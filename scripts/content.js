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
  let showHome = false;
  const url = encodeURIComponent(window.location.href);
  
  let propertyLink = '';
  let properties = '';
  if (window.location.href.indexOf('/card/') > -1) {
    const allLinks = document.querySelectorAll('#content-inner a');
    allLinks.forEach(link => {
      if (link.href.indexOf('/property/card') > -1) {
        propertyLink = link.href;
        const propertyAry = link.href.split('/property/card/');
        properties += propertyAry[1] + '::';
      }
    });
  }
  let badge = document.querySelector('a[data-test-id="inbox-menu"] .badge');
  const page_url = chrome.runtime.getURL(
    "/extension/build/index.html?url=" + url + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + '&showHome' + showHome + '&properties=' + properties
  );
  const logo = chrome.runtime.getURL("/extension/public/images/logo.png");

  const mask = document.createElement("div");
  mask.setAttribute("id", "property_me_externsion_container");
  let modal = document.createElement("div");
  modal.setAttribute("id", "property_me_externsion_popup_button");
    
  modal.innerHTML = `
        <div id="property_me_extension_header">
            <img src="${(propertyLink || window.location.href.indexOf('/property/card') > -1) ? logo : document.querySelector('.img-circle.avatar-non-retina').src}" id="property_me_extension_header_toggle" style="display: block;${(propertyLink || window.location.href.indexOf('/property/card') > -1) ? 'border-radius: 0%' : 'border-radius: 50%'}" />
            <img id="property_me_externsion_avatar" src="${(propertyLink || window.location.href.indexOf('/property/card') > -1) ? document.querySelector('.img-circle.avatar-non-retina').src : logo}" />
        </div>
        <div id="property_me_extension_content">
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
    .querySelector("#property_me_extension_header_toggle")
    .addEventListener("click", () => {
      showHome = false;
      const content_container = document.querySelector("#property_me_extension_content");
      const avatar = document.querySelector("#property_me_externsion_avatar");
      badge = document.querySelector('a[data-test-id="inbox-menu"] .badge');

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
      console.log(document.querySelector("#property_me_extension_content").style.display);
      content.style.display = content.style.display === "none" ? "block" : "none";
      avatar.style.display = content.style.display === "block" ? "block" : "none";

      const iframe_url = chrome.runtime.getURL(
        "/extension/build/index.html?url=" + encodeURIComponent(window.location.href) + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + "&showHome=" + showHome + '&properties=' + properties + "&updated=" + (new Date().getTime())
      );
      document.querySelector("#property_me_extension_content_iframe").src = iframe_url;
    });

  document
    .querySelector('#property_me_externsion_avatar')
    .addEventListener("click", () => {
      showHome = !showHome;
      const iframe_url = chrome.runtime.getURL(
        "/extension/build/index.html?url=" + encodeURIComponent(window.location.href) + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + '&showHome=' + showHome + '&properties=' + properties + "&updated=" + (new Date().getTime())
      );
      document.querySelector("#property_me_extension_content_iframe").src = iframe_url;
    });
  window.addEventListener("popstate", function () {
    setTimeout(() => {
      propertyLink = '';
      properties = '';
      if (window.location.href.indexOf('/card/') > -1) {
        const allLinks = document.querySelectorAll('#content-inner a');
        allLinks.forEach(link => {
          if (link.href.indexOf('/property/card') > -1) {
            propertyLink = link.href;
            const propertyAry = link.href.split('/property/card/');
            properties += propertyAry[1] + '::';
          }
        });
      }
      const iframe_url = chrome.runtime.getURL(
        "/extension/build/index.html?url=" + encodeURIComponent(window.location.href) + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + "&showHome=" + showHome + '&properties=' + properties + "&updated=" + (new Date().getTime())
      );
      document.querySelector("#property_me_extension_content_iframe").src = iframe_url;
      const image_url = (propertyLink || window.location.href.indexOf('/property/card') > -1) ? logo : document.querySelector('.img-circle.avatar-non-retina').src;
      const avatar_url = (propertyLink || window.location.href.indexOf('/property/card') > -1) ? document.querySelector('.img-circle.avatar-non-retina').src : logo;
      document.querySelector('#property_me_extension_header_toggle').src = image_url;
      document.querySelector('#property_me_externsion_avatar').src = avatar_url;
      if (propertyLink || window.location.href.indexOf('/property/card') > -1) {
        document.querySelector('#property_me_extension_header_toggle').style.borderRadius = '0%';
      } else {
        document.querySelector('#property_me_extension_header_toggle').style.borderRadius = '50%';
      }
    }, 2000);
  });
}
