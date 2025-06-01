#!/bin/bash

echo "acs_manager@host2:~$ sudo acs-cli manager install"
echo "Installing manager service..."
echo "[OK] Manager binary installed to /usr/local/bin/acs-manager"
echo "[OK] systemd service created and started"
echo

echo "acs_manager@host2:~$ acs-cli manager rotate-keys"
echo "[OK] Key pair generated"
echo "Public key:"
echo "3f9d7ccebe2456c57faeb11288a5db43fba09a0a1e923d4a63abf1e68861b5b0"
echo

echo "db_node@host1:~$ sudo acs-cli agent install"
echo "Installing agent service..."
echo "[OK] Agent binary installed to /usr/local/bin/acs-agent"
echo "[OK] systemd service created and started"
echo

echo "db_node@host1:~$ acs-cli agent rotate-keys"
echo "[OK] Key pair generated"
echo "Public key:"
echo "0c8a99ff23ba74dc00e43118d11d429eb04b45f2908b7e019adb62c6f1a1cbe1"
echo

echo "db_node@host1:~$ acs-cli agent configure --port 7000 --open-port --manager-key 3f9d7ccebe2456c57faeb11288a5db43fba09a0a1e923d4a63abf1e68861b5b0"
echo "[OK] Configuration updated:"
echo "  port = 7000"
echo "  manager_key = 3f9d7ccebe2456c57faeb11288a5db43fba09a0a1e923d4a63abf1e68861b5b0"
echo

echo "backend_node@host2:~$ sudo acs-cli agent install"
echo "Installing agent service..."
echo "[OK] Agent binary installed to /usr/local/bin/acs-agent"
echo "[OK] systemd service created and started"
echo

echo "backend_node@host2:~$ acs-cli agent rotate-keys"
echo "[OK] Key pair generated"
echo "Public key:"
echo "e7c1dbaef0312aa4a62a6f29db6b3c85ad1a02ff34ab77e13409a0d2217a6c6e"
echo

echo "backend_node@host2:~$ acs-cli agent configure --port 7001 --manager-key 3f9d7ccebe2456c57faeb11288a5db43fba09a0a1e923d4a63abf1e68861b5b0"
echo "[OK] Configuration updated:"
echo "  port = 7001"
echo "  manager_key = 3f9d7ccebe2456c57faeb11288a5db43fba09a0a1e923d4a63abf1e68861b5b0"
echo

echo "acs_manager@host2:~$ acs-cli manager set-agent --name db_node --addr 10.0.0.10 --port 7000 --key 0c8a99ff23ba74dc00e43118d11d429eb04b45f2908b7e019adb62c6f1a1cbe1"
echo "[OK] Agent 'db_node' registered."
echo "  address = 10.0.0.10"
echo "  port    = 7000"
echo "  key     = 0c8a99ff23ba74dc00e43118d11d429eb04b45f2908b7e019adb62c6f1a1cbe1"
echo

echo "acs_manager@host2:~$ acs-cli manager set-agent --name backend_node --addr 127.0.0.1 --port 7001 --key e7c1dbaef0312aa4a62a6f29db6b3c85ad1a02ff34ab77e13409a0d2217a6c6e"
echo "[OK] Agent 'backend_node' registered."
echo "  address = 127.0.0.1"
echo "  port    = 7001"
echo "  key     = e7c1dbaef0312aa4a62a6f29db6b3c85ad1a02ff34ab77e13409a0d2217a6c6e"
echo

echo "acs_manager@host2:~$ acs-cli manager cluster sync --package ./package.tar.gz --config ./cluster_config.json"
echo "[OK] Verifying cluster state..."
echo "[OK] Cluster is in stopped state."
echo "[INFO] Registering services to agents:"
echo "  - api_server_db v1.0.0 on db_node... [OK] Registered"
echo "  - api_server v1.0.0 on backend_node... [OK] Registered"
echo "  - web_server v1.0.0 on backend_node... [OK] Registered"
echo "Starting deployment:"
echo "  - api_server_db on db_node... [OK] Installed"
echo "  - api_server on backend_node... [OK] Installed"
echo "  - web_server on backend_node... [OK] Installed"
echo "[OK] Cluster synchronized successfully"
echo

echo "acs_manager@host2:~$ acs-cli manager cluster show"
echo "[OK] Current cluster topology:"
echo "["
echo "  {"
echo "    \"agent\": \"db_node\","
echo "    \"ip\": \"10.0.0.10\","
echo "    \"port\": 7000,"
echo "    \"services\": ["
echo "      { \"type\": \"api_server_db\", \"version\": \"1.0.0\" }"
echo "    ]"
echo "  },"
echo "  {"
echo "    \"agent\": \"backend_node\","
echo "    \"ip\": \"127.0.0.1\","
echo "    \"port\": 7001,"
echo "    \"services\": ["
echo "      { \"type\": \"api_server\", \"version\": \"1.0.0\" },"
echo "      { \"type\": \"web_server\", \"version\": \"1.0.0\" }"
echo "    ]"
echo "  }"
echo "]"


echo
echo "acs_manager@host2:~$ acs-cli manager cluster start"
echo "Executing start scenario:"
echo "  Step 1: Starting api_server_db... [OK]"
echo "  Step 2: Starting api_server... [OK]"
echo "  Step 3: Starting web_server... [OK]"
echo "[OK] Cluster is now running"
echo

echo "acs_manager@host2:~$ acs-cli manager events"
echo "["
echo "  { \"timestamp\": \"2025-05-20T09:43:10Z\", \"source\": \"manager\", \"event\": \"Cluster started\" },"
echo "  { \"timestamp\": \"2025-05-20T10:10:00Z\", \"source\": \"manager\", \"event\": \"Health checks passed\" }"
echo "]"
echo

echo "acs_manager@host2:~$ acs-cli manager report"
echo "[OK] Cluster report generated."
echo

echo "acs_manager@host2:~$ acs-cli manager reports"
echo "["
echo "  {"
echo "    \"id\": 1,"
echo "    \"timestamp\": \"2025-05-20T10:20:00Z\","
echo "    \"services\": ["
echo "      { \"type\": \"api_server_db\", \"agent\": \"db_node\", \"cpu_usage_avg\": 12, \"memory_usage_avg\": 92, \"available\": true },"
echo "      { \"type\": \"api_server\", \"agent\": \"backend_node\", \"cpu_usage_avg\": 18, \"memory_usage_avg\": 145, \"available\": true },"
echo "      { \"type\": \"web_server\", \"agent\": \"backend_node\", \"cpu_usage_avg\": 6, \"memory_usage_avg\": 48, \"available\": true }"
echo "    ]"
echo "  }"
echo "]"
echo

echo "acs_manager@host2:~$ acs-cli manager cluster stop"
echo "Executing stop scenario:"
echo "  Step 1: Stopping web_server... [OK]"
echo "  Step 2: Stopping api_server... [OK]"
echo "  Step 3: Stopping api_server_db... [OK]"
echo "[OK] Cluster is now stopped"
echo

echo "acs_manager@host2:~$ acs-cli manager cluster sync --package ./package.tar.gz --config ./cluster_config_empty.json"
echo "[OK] Verifying cluster state..."
echo "[OK] Cluster is in stopped state."
echo "[INFO] Removing services:"
echo "  - web_server from backend_node... [OK] Removed"
echo "  - api_server from backend_node... [OK] Removed"
echo "  - api_server_db from db_node... [OK] Removed"
echo "[INFO] Excluding services:"
echo "  - web_server v1.0.0 on db_node... [OK] Excluded"
echo "  - api_server v1.0.0 on db_node... [OK] Excluded"
echo "  - api_server_db v1.0.0 on db_node... [OK] Excluded"
echo "[OK] All services removed from cluster"
echo

echo "acs_manager@host2:~$ acs-cli manager cluster show"
echo "[OK] Current cluster topology:"
echo "["
echo "  {"
echo "    \"agent\": \"db_node\","
echo "    \"ip\": \"10.0.0.10\","
echo "    \"port\": 7000,"
echo "    \"services\": []"
echo "  },"
echo "  {"
echo "    \"agent\": \"backend_node\","
echo "    \"ip\": \"127.0.0.1\","
echo "    \"port\": 7001,"
echo "    \"services\": []"
echo "  }"
echo "]"
