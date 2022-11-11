chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "popup-modal" && !isOpen) {
    isOpen = true;
    chrome.storage.sync.get(
      ["giftlist_access_token", "is_first"],
      async function (result) {
        const isFirst = result.is_first;
        if (result) {
          result = await checkTokenValid();
        }
        showModal(result, isFirst);
      }
    );
  }
});

if (window.location.href.indexOf('app.propertyme.com') > -1 && document.readyState !== 'loading') {
  setTimeout(() => {
    insertButton();
  }, 5000);
}

window.document.onload = function(e) {
  console.log(e);
}

function insertButton() {
  const url = encodeURIComponent(window.location.href);
  
  let propertyLink = '';
  if (window.location.href.indexOf('/card/') > -1) {
    const allLinks = document.querySelectorAll('#content-inner a');
    allLinks.forEach(link => {
      if (link.href.indexOf('/property/') > -1) {
        propertyLink = link.href;
      }
    });
  }
  let badge = document.querySelector('a[data-test-id="inbox-menu"] .badge');
  const page_url = chrome.runtime.getURL(
    "/extension/build/index.html?url=" + url + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0)
  );
  const logo = chrome.runtime.getURL("/extension/public/images/logo.png");

  const mask = document.createElement("div");
  mask.setAttribute("id", "property_me_externsion_container");
  const modal = document.createElement("div");
  modal.setAttribute("id", "property_me_externsion_popup_button");

  modal.innerHTML = `
        <div id="property_me_extension_header">
            <img src="${logo}" id="property_me_extension_header_toggle" style="${(propertyLink || window.location.href.indexOf('/property/') > -1) ? 'display: block' : 'display: none'}" />
            <img id="property_me_externsion_avatar" style="${(propertyLink || window.location.href.indexOf('/property/') > -1) ? 'display: none' : 'display: block'}" src="${document.querySelector('.img-circle.avatar-non-retina').src}" />
        </div>
        <div id="property_me_extension_content" style="display: none;">
            <iframe src="${page_url}" id="property_me_extension_content_iframe" />
        </div>
    `;

  mask.innerHTML = modal.outerHTML;
  document.body.appendChild(mask);

  var eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  // Listen to message from child window
  eventer(
    messageEvent,
    function (e) {
      console.log("parent received message!:  ", e.data);
      document.getElementById("property_me_extension_content_iframe").height =
        e.data + "px";
    },
    false
  );

  document
    .querySelector("#property_me_extension_header")
    .addEventListener("click", () => {
      const content_container = document.querySelector("#property_me_extension_content");
      const avatar = document.querySelector("#property_me_externsion_avatar");
      const logo = document.querySelector("#property_me_extension_header_toggle");
      badge = document.querySelector('a[data-test-id="inbox-menu"] .badge');
      
      if (propertyLink || window.location.href.indexOf('/property/') > -1) {
        avatar.style.display = content_container.style.display === "none" ? "flex" : "none";
      } else {
        logo.style.display = content_container.style.display === "none" ? "flex" : "none";
      }

      document.querySelector(
        "#property_me_extension_header"
      ).style.borderBottom = content_container.style.display === "none" ? "1px solid green" : "none";
      document.querySelector(
        "#property_me_extension_header"
      ).style.paddingBottom = content_container.style.display === "none" ? "5px" : "0px";
      document.querySelector(
        "#property_me_extension_header"
      ).style.marginBottom = content_container.style.display === "none" ? "5px" : "0px";
      const content = document.querySelector("#property_me_extension_content");

      content.style.display = content.style.display === "none" ? "block" : "none";

      const iframe_url = chrome.runtime.getURL(
        "/extension/build/index.html?url=" + encodeURIComponent(window.location.href) + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + "&updated=" + (new Date().getTime())
      );
      document.querySelector("#property_me_extension_content_iframe").src = iframe_url;
    });
  window.addEventListener("popstate", function () {
    const iframe_url = chrome.runtime.getURL(
      "/extension/build/index.html?url=" + encodeURIComponent(window.location.href) + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + "&updated=" + (new Date().getTime())
    );
    document.querySelector("#property_me_extension_content_iframe").src = iframe_url;
    propertyLink = '';
    if (window.location.href.indexOf('/card/') > -1) {
      const allLinks = document.querySelectorAll('#content-inner a');
      allLinks.forEach(link => {
        if (link.href.indexOf('/property/') > -1) {
          propertyLink = link.href;
        }
      });
    }
    const avatar = document.querySelector("#property_me_externsion_avatar");
    const logo = document.querySelector("#property_me_extension_header_toggle");

    if (propertyLink || window.location.href.indexOf('/property/') > -1) {
      logo.style.display = "flex";
      avatar.style.display = "none";
    } else {
      logo.style.display = "none";
      avatar.style.display = "flex";
    }
    window.addEventListener('message', e => {
      console.log(e.data);
    }, false)
  });
}
