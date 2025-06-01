import "./paged.js";
// import "./reload-in-place.js"

import "../styles/normalize.css";
import "../styles/interface.css";
import "../styles/style.css"

// class RepeatTableHeadersHandler extends Paged.Handler {
//   constructor(chunker, polisher, caller) {
//     super(chunker, polisher, caller);
//     this.splitTablesRefs = [];
//   }

//   onBreakToken(breakToken, a, b) {
//     if (!breakToken) return breakToken;
//     let element = breakToken.node;
//     if (!element) return breakToken;

//     let i = element;
//     while (i.parentNode && i.parentNode.nodeType === 1) {
//       if (i.parentNode.nodeName == "TBODY") {
//         i.setAttribute("remove-header-line", true)
//         let clonedTr = i.cloneNode(true);
//         i.parentNode.insertBefore(clonedTr, i.nextSibling)
//         i.remove()
//         breakToken.node = clonedTr
//         breakToken.offset = 0
//         return breakToken
//       }
//       i = i.parentNode;
//     }

//     return breakToken;
//   }

//   afterPageLayout(pageElement, page, breakToken, chunker) {
//     this.chunker = chunker;
//     this.splitTablesRefs = [];

//     if (breakToken) {
//       const node = breakToken.node;
//       const tables = this.findAllAncestors(node, "table");
//       if (node.tagName === "TABLE") tables.push(node);

//       if (tables.length > 0) {
//         this.splitTablesRefs = tables.map((t) => t.dataset.ref);

//         let thead =
//           node.tagName === "THEAD"
//             ? node
//             : this.findFirstAncestor(node, "thead");
//         if (thead) {
//           let lastTheadNode = thead.hasChildNodes()
//             ? thead.lastChild
//             : thead;
//           breakToken.node = this.nodeAfter(lastTheadNode, chunker.source);
//         }

//         this.hideEmptyTables(pageElement, node);
//       }
//     }
//   }

//   hideEmptyTables(pageElement, breakTokenNode) {
//     this.splitTablesRefs.forEach((ref) => {
//       let table = pageElement.querySelector("[data-ref='" + ref + "']");
//       if (table) {
//         let sourceBody = table.querySelector("tbody > tr");
//         if (
//           !sourceBody ||
//           this.refEquals(sourceBody.firstElementChild, breakTokenNode)
//         ) {
//           table.style.visibility = "hidden";
//           table.style.position = "absolute";
//           let lineSpacer = table.nextSibling;
//           if (lineSpacer) {
//             lineSpacer.style.visibility = "hidden";
//             lineSpacer.style.position = "absolute";
//           }
//         }
//       }
//     });
//   }

//   refEquals(a, b) {
//     return (
//       a && a.dataset && b && b.dataset && a.dataset.ref === b.dataset.ref
//     );
//   }

//   findFirstAncestor(element, selector) {
//     while (element.parentNode && element.parentNode.nodeType === 1) {
//       if (element.parentNode.matches(selector)) return element.parentNode;
//       element = element.parentNode;
//     }
//     return null;
//   }

//   findAllAncestors(element, selector) {
//     const ancestors = [];
//     while (element.parentNode && element.parentNode.nodeType === 1) {
//       if (element.parentNode.matches(selector))
//         ancestors.unshift(element.parentNode);
//       element = element.parentNode;
//     }
//     return ancestors;
//   }

//   layout(rendered, layout) {
//     this.splitTablesRefs.forEach((ref) => {
//       const renderedTable = rendered.querySelector(
//         "[data-ref='" + ref + "']",
//       );
//       if (renderedTable) {
//         if (!renderedTable.getAttribute("repeated-headers")) {
//           const sourceTable = this.chunker.source.querySelector(
//             "[data-ref='" + ref + "']",
//           );
//           this.repeatColgroup(sourceTable, renderedTable);
//           this.repeatTHead(sourceTable, renderedTable);
//           renderedTable.setAttribute("repeated-headers", true);
//         }
//       }
//     });
//   }

//   repeatColgroup(sourceTable, renderedTable) {
//     let colgroup = sourceTable.querySelectorAll("colgroup");
//     let firstChild = renderedTable.firstChild;
//     colgroup.forEach((colgroup) => {
//       let clonedColgroup = colgroup.cloneNode(true);
//       renderedTable.insertBefore(clonedColgroup, firstChild);
//     });
//   }

//   repeatTHead(sourceTable, renderedTable) {
//     let thead = sourceTable.querySelector("thead");
//     let caption = sourceTable.querySelector("caption");

//     if (thead && !renderedTable.querySelector("thead")) {
//       let clonedThead = thead.cloneNode(true);
//       renderedTable.insertBefore(clonedThead, renderedTable.firstChild);
//     }

//     if (caption && !renderedTable.querySelector("caption")) {

//       let allTables = document.querySelectorAll('[data-ref="' + renderedTable.getAttribute("data-ref") + '"]')
//       let visible = [...allTables].filter(t => {
//         const style = getComputedStyle(t);
//         return style.visibility != "hidden";
//       });
//       // let i = 0;
//       // while (i < visible.length) {
//       //   let t = visible[i]
//       //   let hasTrToRemove = t.querySelector("tbody tr")?.hasAttribute("remove-header-line")
//       //   if (hasTrToRemove && i != 0) {
//       //     visible[i - 1].style.visibility = "hidden"
//       //     visible[i - 1].style.position = "absolute"
//       //     visible.splice(i - 1, 1)
//       //     i = 0;
//       //   } else {
//       //     i += 1;
//       //   }
//       // }

//       let clonedCaption = caption.cloneNode(true);
//       if (visible.indexOf(renderedTable) > 0) clonedCaption.classList.add("continued");
//       renderedTable.insertBefore(clonedCaption, renderedTable.firstChild);
//     }
//   }

//   nodeAfter(node, limiter) {
//     if (limiter && node === limiter) return;
//     let significantNode = this.nextSignificantNode(node);
//     if (significantNode) return significantNode;
//     if (node.parentNode) {
//       while ((node = node.parentNode)) {
//         if (limiter && node === limiter) return;
//         significantNode = this.nextSignificantNode(node);
//         if (significantNode) return significantNode;
//       }
//     }
//   }

//   nextSignificantNode(sib) {
//     while ((sib = sib.nextSibling)) {
//       if (!this.isIgnorable(sib) || sib.nodeName === "TD") return sib;
//     }
//     return null;
//   }

//   isIgnorable(node) {
//     return (
//       node.nodeType === 8 ||
//       (node.nodeType === 3 && this.isAllWhitespace(node))
//     );
//   }

//   isAllWhitespace(node) {
//     return !/[^\t\n\r ]/.test(node.textContent);
//   }

//   afterRendered(pages) {
//     for (const page of pages) {
//       for (const tr of page.area.querySelectorAll('[remove-header-line="true"]')) {
//         let ref = tr.getAttribute("data-ref")
//         let row = document.querySelector('[data-ref="' + ref + '"]')
//         let table = row.closest("table")
//         if (table.querySelectorAll("tbody tr").length == 1) {
//           tr.closest("table").querySelector("caption").classList.remove("continued")
//           table.remove()
//         } else {
//           row.remove()
//         }
//       }
//     }
//   }
// }



class RepeatTableHeadersHandler extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller)
    this.splitTablesRefs = []
  }

  afterPageLayout(pageElement, page, breakToken, chunker) {
    this.chunker = chunker
    this.splitTablesRefs = []

    if (breakToken) {
      const node = breakToken.node
      const tables = this.findAllAncestors(node, "table")
      if (node.tagName === "TABLE") tables.push(node)

      if (tables.length > 0) {
        this.splitTablesRefs = tables.map(t => t.dataset.ref)

        let thead = node.tagName === "THEAD" ? node : this.findFirstAncestor(node, "thead")
        if (thead) {
          let lastTheadNode = thead.hasChildNodes() ? thead.lastChild : thead
          breakToken.node = this.nodeAfter(lastTheadNode, chunker.source)
        }

        this.hideEmptyTables(pageElement, node)
      }
    }
  }

  hideEmptyTables(pageElement, breakTokenNode) {
    this.splitTablesRefs.forEach(ref => {
      let table = pageElement.querySelector("[data-ref='" + ref + "']")
      if (table) {
        let sourceBody = table.querySelector("tbody > tr")
        if (!sourceBody || this.refEquals(sourceBody.firstElementChild, breakTokenNode)) {
          table.style.visibility = "hidden"
          table.style.position = "absolute"
          let lineSpacer = table.nextSibling
          if (lineSpacer) {
            lineSpacer.style.visibility = "hidden"
            lineSpacer.style.position = "absolute"
          }
        }
      }
    })
  }

  refEquals(a, b) {
    return a && a.dataset && b && b.dataset && a.dataset.ref === b.dataset.ref
  }

  findFirstAncestor(element, selector) {
    while (element.parentNode && element.parentNode.nodeType === 1) {
      if (element.parentNode.matches(selector)) return element.parentNode
      element = element.parentNode
    }
    return null
  }

  findAllAncestors(element, selector) {
    const ancestors = []
    while (element.parentNode && element.parentNode.nodeType === 1) {
      if (element.parentNode.matches(selector)) ancestors.unshift(element.parentNode)
      element = element.parentNode
    }
    return ancestors
  }

  layout(rendered, layout) {
    this.splitTablesRefs.forEach(ref => {
      const renderedTable = rendered.querySelector("[data-ref='" + ref + "']")
      if (renderedTable) {
        if (!renderedTable.getAttribute("repeated-headers")) {
          const sourceTable = this.chunker.source.querySelector("[data-ref='" + ref + "']")
          this.repeatColgroup(sourceTable, renderedTable)
          this.repeatTHead(sourceTable, renderedTable)
          this.repeatCaption(sourceTable, renderedTable)
          renderedTable.setAttribute("repeated-headers", true)
        }
      }
    })
  }

  repeatColgroup(sourceTable, renderedTable) {
    let colgroup = sourceTable.querySelectorAll("colgroup")
    let firstChild = renderedTable.firstChild
    colgroup.forEach((colgroup) => {
      let clonedColgroup = colgroup.cloneNode(true)
      renderedTable.insertBefore(clonedColgroup, firstChild)
    })
  }

  repeatTHead(sourceTable, renderedTable) {
    let thead = sourceTable.querySelector("thead")
    if (renderedTable.querySelector("thead")) {
      return;
    }
    if (thead) {
      let clonedThead = thead.cloneNode(true)
      renderedTable.insertBefore(clonedThead, renderedTable.firstChild)
    }
  }

  repeatCaption(sourceTable, renderedTable) {
    let ref = sourceTable.dataset.id
    let tableSplits = document.querySelectorAll(`[data-id="${ref}"]`);
    let isFirst = [...tableSplits].filter(t => t.style.visibility != "hidden").indexOf(renderedTable) == 0

    if (renderedTable.querySelector("caption")) {
      return;
    }

    let caption = sourceTable.querySelector("caption")
    if (caption) {
      let clonedCaption = caption.cloneNode(true)
      if (!isFirst) {
        clonedCaption.classList.add("continued")
      }
      renderedTable.insertBefore(clonedCaption, renderedTable.firstChild)
    }
  }

  nodeAfter(node, limiter) {
    if (limiter && node === limiter) return
    let significantNode = this.nextSignificantNode(node)
    if (significantNode) return significantNode
    if (node.parentNode) {
      while ((node = node.parentNode)) {
        if (limiter && node === limiter) return
        significantNode = this.nextSignificantNode(node)
        if (significantNode) return significantNode
      }
    }
  }

  nextSignificantNode(sib) {
    while ((sib = sib.nextSibling)) { if (!this.isIgnorable(sib)) return sib }
    return null
  }

  isIgnorable(node) {
    return (
      (node.nodeType === 8)
      || ((node.nodeType === 3) && this.isAllWhitespace(node))
    )
  }

  isAllWhitespace(node) {
    return !(/[^\t\n\r ]/.test(node.textContent))
  }
}




class Builder {
  constructor() {
    this.content = null
    this.preview = null
  }

  async waitForElementsInIframe(iframe, selector, expectedCount, timeout = 20000) {
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    return new Promise((resolve) => {
      const check = () => {
        const elements = doc.querySelectorAll(selector);
        if (elements.length >= expectedCount) {
          observer.disconnect();
          resolve(Array.from(elements));
        }
      };

      const observer = new MutationObserver(check);
      // console.log(doc.body)
      observer.observe(doc.body, { childList: true, subtree: true });

      // Стартовая проверка на случай, если всё уже загружено
      check();

      // Безопасный выход после timeout
      setTimeout(() => {
        observer.disconnect();
        resolve(Array.from(doc.querySelectorAll(selector)));
      }, timeout);
    });
  }

  async loadPreview() {
    let num = document.querySelectorAll("a, h1, h2, h3").length;

    let iframe = document.getElementById("preview");
    await new Promise((resolve, reject) => {
      iframe.addEventListener("load", resolve, { once: true })
      iframe.addEventListener("error", reject, { once: true })
    })
    await this.waitForElementsInIframe(iframe, "a, h1, h2, h3", num)

    this.preview = iframe.contentDocument.body
  }

  async build() {
    await this.loadPreview()

    const APPLICATION_LETTERS = "АБВГДЕЖЗ"

    let i = 0;
    for (const h1 of document.querySelectorAll("h1")) {
      if (!h1.hasAttribute("application")) {
        continue;
      }

      // this.preview.querySelector(`[data-id="${h1.id}"]`).setAttribute("application", APPLICATION_LETTERS[i])
      h1.setAttribute("application", APPLICATION_LETTERS[i])
      i++
    }

    this.resolve_headers_idents()
    this.resolve_links()
    this.build_toc()

    this.add_application_attrs()

    document.getElementById("preview").remove()

    await MathJax.startup.promise;

    let previewer = new Paged.Previewer({
      auto: false,
    });
    Paged.registerHandlers(RepeatTableHeadersHandler);
    await previewer.preview();

    for (const header of document.querySelectorAll("h1")) {
      if (header.hasAttribute("application")) {
        for (const hgroup of document.querySelectorAll(`[data-ref="${header.parentNode.dataset.ref}"]`)) {
          for (const caption of hgroup.querySelectorAll("caption, figcaption")) {
            caption.setAttribute("application", header.getAttribute("application"))
          }
        }
      }
    }
  }

  find_upper_header(header, targetName) {
    let hgroup = header?.parentNode?.parentNode
    let hgroupRef = hgroup?.dataset?.ref;
    if (!hgroupRef) return null;

    for (const hgroup of this.preview.querySelectorAll(`[data-ref="${hgroupRef}"]`)) {
      const h = hgroup?.firstChild
      if (!h || h.nodeType != 1 || h.nodeName != targetName) continue;
      return h;
    }

    return null;
  }

  resolve_headers_idents() {
    for (const header of this.preview.querySelectorAll("h2, h3, h4")) {
      if (header.nodeName == "H2") {
        header.dataset.headerIdent = header.dataset.counterSectioncounterValue
      }

      if (header.nodeName == "H3") {
        let h2 = this.find_upper_header(header, "H2")
        header.dataset.headerIdent = h2.dataset.headerIdent + "." + header.dataset.counterSubsectioncounterValue
      }

      if (header.nodeName == "H4") {
        let h3 = this.find_upper_header(header, "H3")
        header.dataset.headerIdent = h3.dataset.headerIdent + "." + header.dataset.counterSubsubsectioncounterValue
      }
    }
  }

  add_application_attrs() {
    for (const caption of document.querySelectorAll("hgroup[application] caption")) {
      const application = caption.closest("hgroup")?.getAttribute("application");
      if (application) caption.setAttribute("application", application);
    }
  }

  resolve_links() {
    for (const link of document.querySelectorAll("a")) {
      if (!link || link.nodeType != 1) continue;

      let originalTarget = document.querySelector(link.getAttribute("href"))
      let target = this.preview.querySelector(link.getAttribute("href"))
      if (target?.nodeType != 1) continue;

      let content = link.textContent.length > 0 ? link.textContent + " " : ""

      if (target.nodeName == "TABLE") {
        content += target.getAttribute("data-counter-tablecounter-value")
      }

      if (target.nodeName == "FIGURE") {
        content += target.getAttribute("data-counter-figcounter-value")
      }

      if (target.classList.contains("formula")) {
        content += target.getAttribute("data-counter-formulacounter-value")
      }

      if (target.nodeName == "H2" || target.nodeName == "H3" || target.nodeName == "H4") {
        content += target.dataset.headerIdent
      }

      if (originalTarget?.nodeName == "H1") {
        let app_letter = originalTarget.getAttribute("application")
        if (app_letter) {
          content += app_letter;
        }
      }

      if (content.length > 0) link.innerText = content
    }
  }

  build_toc() {
    let toc = document.getElementById("toc-list")
    if (!toc) return;

    for (const header of this.preview.querySelectorAll("h1, h2, h3")) {
      console.log(header)
      let link = document.createElement("a")
      link.href = `#${header.id}`

      let title = document.createElement("span")
      let pageNumber = document.createElement("span")

      let clonedHeader = header.cloneNode(true)

      if (clonedHeader.nodeName == "H1") {
        link.classList.add("uppercase-header")
        title.innerHTML = clonedHeader.innerHTML
      } else {
        title.textContent = header.dataset.headerIdent + " " + header.textContent
      }
      link.appendChild(title)
      if (header.nodeName == "H3") {
        link.style.paddingLeft = "0.8em";
      }

      pageNumber.textContent = header.closest(".pagedjs_page").dataset.pageNumber
      link.appendChild(pageNumber)

      toc.appendChild(link)
    }
  }
}

await new Builder().build()