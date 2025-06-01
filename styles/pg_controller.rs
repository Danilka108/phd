use serde_json::Value;
use transactional_ops::{Transactional, Transaction, RollbackError};
use crate::system::{PackageManager, ServiceManager, FileSystem};

pub struct PostgresController {
    config: Option<PostgresConfig>,
    pkg_manager: PackageManager,
    service_manager: ServiceManager,
    fs: FileSystem,
}

impl Transactional for PostgresController {
    type Error = ControllerError;

    async fn execute(&mut self, op: Transaction) -> Result<(), RollbackError<Self::Error>> {
        match op {
            Transaction::Install => self.install().await,
            Transaction::Uninstall => self.uninstall().await,
            _ => Err(ControllerError::UnsupportedOperation.into()),
        }
    }
}

impl PostgresController {
    pub fn new() -> Self {
        Self {
            config: None,
            pkg_manager: PackageManager::new(),
            service_manager: ServiceManager::new("postgresql"),
            fs: FileSystem::new(),
        }
    }

    pub async fn set_config(&mut self, config: &str) -> Result<(), ControllerError> {
        let config_value: Value = serde_json::from_str(config)?;
        self.config = Some(PostgresConfig::from_json(config_value)?;
        Ok(())
    }

    async fn install(&self) -> Result<(), RollbackError<ControllerError>> {
        let config = self.config.as_ref().ok_or(ControllerError::NotConfigured)?;
        
        self.pkg_manager.install("postgresql-16")
            .map_err(|e| RollbackError::new(e)
            .and_then(|_| {
                self.service_manager.configure(&config.to_conf_file())
                    .map_err(|e| RollbackError::with_rollback(
                        e,
                        || self.pkg_manager.remove("postgresql-16")
                    ))
            })
            .and_then(|_| {
                self.service_manager.exec("initdb", &["--auth=scram-sha-256"])
                    .map_err(|e| RollbackError::with_rollback(
                        e,
                        || {
                            self.pkg_manager.remove("postgresql-16")?;
                            self.service_manager.reset_config()
                        }
                    ))
            })
            .and_then(|_| {
                self.service_manager.exec("createuser", &[&config.user_name])
                    .map_err(|e| RollbackError::with_rollback(
                        e,
                        || {
                            self.pkg_manager.remove("postgresql-16")?;
                            self.service_manager.reset_config()?;
                            self.service_manager.exec("dropdb", &["postgres"])
                        }
                    ))
            })?;

        Ok(())
    }

    async fn uninstall(&self) -> Result<(), RollbackError<ControllerError>> {
        self.service_manager.stop()
            .map_err(RollbackError::new)?;
            
        self.pkg_manager.remove("postgresql-16")
            .map_err(RollbackError::new)?;
            
        Ok(())
    }
}

#[derive(serde::Deserialize)]
struct PostgresConfig {
    user_name: String,
    db_name: String,
}

impl PostgresConfig {
    fn from_json(value: Value) -> Result<Self, ControllerError> {
        serde_json::from_value(value).map_err(Into::into)
    }
    
    fn to_conf_file(&self) -> String {
        format!("# Config for {}\n", self.db_name)
    }
}