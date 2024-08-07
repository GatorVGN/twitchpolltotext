javascript: (function () {
    let cleanCurrentChannel = "";
    if (window.location.pathname.includes("/u/")) {
      const a = window.location.pathname.split("/u/").pop();
      cleanCurrentChannel = a.substring(0, a.indexOf("/"));
    } else {
      cleanCurrentChannel = window.location.pathname.split("/").pop();
    }
  
    const theWindow = window.open(
      `https://www.twitch.tv/popout/${cleanCurrentChannel}/poll`,
      "Poll",
      "location=yes,height=570,width=520,scrollbars=yes,status=yes"
    );
  
    var d = theWindow.document;
    var s = d.createElement("script");
  
    function injectThis() {
      async function waitForElm(selector) {
        return new Promise((resolve) => {
          if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
          }
  
          const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
              observer.disconnect();
              resolve(document.querySelector(selector));
            }
          });
          observer.observe(document.body, { childList: !0, subtree: !0 });
        });
      }
  
      async function waitForAllElm(selector) {
        return new Promise((resolve) => {
          if (document.querySelectorAll(selector)) {
            return resolve(document.querySelectorAll(selector));
          }
  
          const observer = new MutationObserver((mutations) => {
            if (document.querySelectorAll(selector)) {
              observer.disconnect();
              resolve(document.querySelectorAll(selector));
            }
          });
          observer.observe(document.body, { childList: !0, subtree: !0 });
        });
      }
  
      /**
       *
       * @returns Returns Node-Elements of the Title of all poll results
       */
      const getAll = () => {
        return new Promise((res, rej) => {
          const test = [];
          waitForElm("[data-test-selector]").then((res1) => {
            test.push(res1);
            waitForAllElm('[data-test-selector="title"]').then((res2) => {
              test.push(res2);
              res(test);
            });
          });
        });
      };
  
      const insertCopyButton = (copyText, isError = false) => {
        const button = document.createElement("div");
        button.style =
        "position: absolute;z-index: 9999;min-height: 3rem;width: 100%25;text-align: center;padding: 0rem;background-color: %236441a5;line-height: 3rem;";
  
        if (isError) {
          button.innerText = "Well this didn't work, sorry. 😢";
  
          const info = document.createElement('p');
          info.innerText = copyText;
          button.append(info);
  
        } else {
          button.innerText = "Copy Poll Info";
          button.addEventListener("click", () => {
            navigator.clipboard.writeText(copyText);
            button.innerText = "text coppied!";
            button.style.backgroundColor = "green";
          });  
        }
        
        const body = document.querySelector("body");
        const bodyDiv = document.querySelector("body > div");
        body.insertBefore(button, bodyDiv);
      };
  
      getAll().then((result) => {
        try {
          const pollQuestion = document.querySelector("[data-test-selector='header'] + p:last-child ").textContent;
  
          const questions = Array.from(result[1]).map((elem, index) => {
            return ` /vote ${index + 1} für "${elem.textContent}"`;
          });
  
          const copyText = `Abstimmung: ${pollQuestion} -${questions}`;
  
          insertCopyButton(copyText);
        } catch (error) {
          console.error("🛑 > error: ", error.message);
          insertCopyButton(error.message, true)
        }
      });
    }
    s.innerHTML = "window.onload = " + injectThis.toString() + ";";
    d.getElementsByTagName("head")[0].appendChild(s);
  })();