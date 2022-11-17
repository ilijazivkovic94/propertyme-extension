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

async function getMessagesCount() {
  let result = {
    inbox: 0,
    outbox: 0,
    bills: 0,
  };

  const inbox_result = await fetch('https://app.propertyme.com/api/comms/threads/unread?format=json', {
    method: 'GET',
  }).then(res => res.json());
  result.inbox = inbox_result?.Unread || 0;

  const outbox_result = await fetch('https://app.propertyme.com/api/comms/messages/summary?format=json', {
    method: 'GET',
  }).then(res => res.json());
  result.outbox = outbox_result?.Emails || 0;

  const bills_result = await fetch('https://app.propertyme.com/api/financial/bills/count-drafts?format=json', {
    method: 'GET',
  }).then(res => res.json());
  result.bills = bills_result || 0;
  console.log(encodeURIComponent(JSON.stringify(result)));
  return encodeURIComponent(JSON.stringify(result));
}

async function insertButton() {
  let showHome = false;
  const url = encodeURIComponent(window.location.href);

  let count_result = await getMessagesCount();
  
  let propertyLink = '';
  let properties = '';
  let contacts = '';
  if (window.location.href.indexOf('/card/') > -1 || window.location.href.indexOf('/folio/') > -1) {
    const allLinks = document.querySelectorAll('#content-inner a');
    allLinks.forEach(link => {
      if (link.href.indexOf('/property/') > -1 && link.href.indexOf('/property/list') < 0) {
        propertyLink = link.href.split('?')[0];
        const propertyAry = link.href.split('?')[0].split('/');
        properties += propertyAry[propertyAry.length - 1] + '::';
      }
    });
  }
  if (window.location.href.indexOf('/property/tenant/edit/') > -1) {
    const linkAry = window.location.href.split('?')[0].split('/property/tenant/edit/');
    properties += linkAry[linkAry.length - 1] + '::';
  }
  if (window.location.href.indexOf('/contact/edit/') > -1) {
    const linkAry = window.location.href.split('?')[0].split('/contact/edit/');
    contacts += linkAry[linkAry.length - 1] + '::';
  }
  if (window.location.href.indexOf('/portal-access/folio-invites/') > -1) {
    const linkAry = window.location.href.split('?')[1].split('=');
    contacts += linkAry[linkAry.length - 1] + '::';
  }
  let badge = document.querySelector('a[data-test-id="inbox-menu"] .badge');
  const page_url = chrome.runtime.getURL(
    "/extension/build/index.html?url=" + url + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + '&showHome' + showHome + '&properties=' + properties + '&contacts=' + contacts + '&data=' + count_result
  );
  const logo = chrome.runtime.getURL("/extension/public/images/logo.png");

  const mask = document.createElement("div");
  mask.setAttribute("id", "property_me_externsion_container");
  let modal = document.createElement("div");
  modal.setAttribute("id", "property_me_externsion_popup_button");
  modal.setAttribute("draggable", "true");
    
  modal.innerHTML = `
        <div id="property_me_extension_header">
            <img draggable="false" src="${(propertyLink || (window.location.href.indexOf('/property/') > -1 && window.location.href.indexOf('/property/list') < 0) || window.location.href.indexOf('/folio/') > -1 || window.location.href.indexOf('/contact/edit/') > -1 || window.location.href.indexOf('/portal-access/folio-invites/') > -1) ? logo : document.querySelector('.img-circle.avatar-non-retina').src}" id="property_me_extension_header_toggle" style="display: block;${(propertyLink || (window.location.href.indexOf('/property/') > -1 && window.location.href.indexOf('/property/list') < 0) || window.location.href.indexOf('/contact/edit/') > -1 || window.location.href.indexOf('/portal-access/folio-invites/') > -1) ? 'border-radius: 0%' : 'border-radius: 50%'}" />
            <img draggable="false" id="property_me_externsion_avatar" src="${(propertyLink || (window.location.href.indexOf('/property/') > -1 && window.location.href.indexOf('/property/list') < 0) || window.location.href.indexOf('/folio/') > -1 || window.location.href.indexOf('/contact/edit/') > -1 || window.location.href.indexOf('/portal-access/folio-invites/') > -1) ? document.querySelector('.img-circle.avatar-non-retina').src : logo}" />
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
      if (e.data.type === 'open') {
        window.open(e.data.link, '_blank');
      }
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
      if (!content_container.style.display) {
        content_container.style.display = 'none';
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
      console.log(document.querySelector("#property_me_extension_content").style.display);
      content.style.display = content.style.display === "none" ? "block" : "none";
      avatar.style.display = content.style.display === "block" ? "block" : "none";

      const iframe_url = chrome.runtime.getURL(
        "/extension/build/index.html?url=" + encodeURIComponent(window.location.href) + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + "&showHome=" + showHome + '&properties=' + properties + '&contacts=' + contacts + '&data=' + count_result + "&updated=" + (new Date().getTime())
      );
      document.querySelector("#property_me_extension_content_iframe").src = iframe_url;

      if (propertyLink || (window.location.href.indexOf('/property/') > -1 && window.location.href.indexOf('/property/list') < 0) || window.location.href.indexOf('/folio/') > -1 || window.location.href.indexOf('/contact/edit/') > -1 || window.location.href.indexOf('/portal-access/folio-invites/') > -1) {
        document.querySelector('#property_me_extension_header_toggle').src = logo;
        avatar.src = document.querySelector('.img-circle.avatar-non-retina').src;
        document.querySelector('#property_me_extension_header_toggle').style.borderRadius = '0%';
        avatar.style.borderRadius = '50%';
      } else {
        document.querySelector('#property_me_extension_header_toggle').src = document.querySelector('.img-circle.avatar-non-retina').src;
        avatar.src = logo;
        document.querySelector('#property_me_extension_header_toggle').style.borderRadius = '50%';
        avatar.style.borderRadius = '0%';
      }
    });

  document
    .querySelector('#property_me_externsion_avatar')
    .addEventListener("click", () => {
      if (propertyLink || (window.location.href.indexOf('/property/') > -1 && window.location.href.indexOf('/property/list') < 0) || window.location.href.indexOf('/folio/') > -1 || window.location.href.indexOf('/contact/edit/') > -1 || window.location.href.indexOf('/portal-access/folio-invites/') > -1) {
        
      } else {
        return;
      }
      showHome = !showHome;
      const iframe_url = chrome.runtime.getURL(
        "/extension/build/index.html?url=" + encodeURIComponent(window.location.href) + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + '&showHome=' + showHome + '&properties=' + properties + '&contacts=' + contacts + '&data=' + count_result + "&updated=" + (new Date().getTime())
      );
      document.querySelector("#property_me_extension_content_iframe").src = iframe_url;
      
      const avatar = document.querySelector("#property_me_externsion_avatar");
      const logoImg = document.querySelector("#property_me_extension_header_toggle");
      const avatarSrc = avatar.src;
      avatar.src = logoImg.src;
      logoImg.src = avatarSrc;
      
      if (showHome) {
        avatar.style.borderRadius = '0%';
        logoImg.style.borderRadius = '50%';
      } else {
        avatar.style.borderRadius = '50%';
        logoImg.style.borderRadius = '0%';
      }
    });
  window.addEventListener("popstate", function () {
    setTimeout(() => {
      showHome = false;
      propertyLink = '';
      properties = '';
      contacts = '';
      if (window.location.href.indexOf('/card/') > -1 || window.location.href.indexOf('/folio/') > -1) {
        const allLinks = document.querySelectorAll('#content-inner a');
        allLinks.forEach(link => {
          if (link.href.indexOf('/property/') > -1 && link.href.indexOf('/property/list') < 0) {
            propertyLink = link.href.split('?')[0];
            const propertyAry = link.href.split('?')[0].split('/');
            properties += propertyAry[propertyAry.length - 1] + '::';
          }
        });
      }
      if (window.location.href.indexOf('/property/tenant/edit/') > -1) {
        const linkAry = window.location.href.split('?')[0].split('/property/tenant/edit/');
        properties += linkAry[linkAry.length - 1] + '::';
      }
      if (window.location.href.indexOf('/contact/edit/') > -1) {
        const linkAry = window.location.href.split('?')[0].split('/contact/edit/');
        contacts += linkAry[linkAry.length - 1] + '::';
      }
      const iframe_url = chrome.runtime.getURL(
        "/extension/build/index.html?url=" + encodeURIComponent(window.location.href) + "&propertyURL=" + encodeURIComponent(propertyLink) + '&unread=' + (badge ? badge.innerText : 0) + "&showHome=" + showHome + '&properties=' + properties + '&contacts=' + contacts + '&data=' + count_result + "&updated=" + (new Date().getTime())
      );
      document.querySelector("#property_me_extension_content_iframe").src = iframe_url;
      const image_url = (propertyLink || (window.location.href.indexOf('/property/') > -1 && window.location.href.indexOf('/property/list') < 0) || window.location.href.indexOf('/folio/') > -1 || window.location.href.indexOf('/contact/edit/') > -1 || window.location.href.indexOf('/portal-access/folio-invites/') > -1) ? logo : document.querySelector('.img-circle.avatar-non-retina').src;
      const avatar_url = (propertyLink || (window.location.href.indexOf('/property/') > -1 && window.location.href.indexOf('/property/list') < 0) || window.location.href.indexOf('/folio/') > -1 || window.location.href.indexOf('/contact/edit/') > -1 || window.location.href.indexOf('/portal-access/folio-invites/') > -1) ? document.querySelector('.img-circle.avatar-non-retina').src : logo;
      document.querySelector('#property_me_extension_header_toggle').src = image_url;
      document.querySelector('#property_me_externsion_avatar').src = avatar_url;
      if (propertyLink || (window.location.href.indexOf('/property/') > -1 && window.location.href.indexOf('/property/list') < 0) || window.location.href.indexOf('/folio/') > -1 || window.location.href.indexOf('/contact/edit/') > -1 || window.location.href.indexOf('/portal-access/folio-invites/') > -1) {
        document.querySelector('#property_me_extension_header_toggle').style.borderRadius = '0%';
        document.querySelector('#property_me_externsion_avatar').style.borderRadius = '50%';
      } else {
        document.querySelector('#property_me_extension_header_toggle').style.borderRadius = '50%';
        document.querySelector('#property_me_externsion_avatar').style.borderRadius = '0%';
      }
    }, 3000);
  });

  document
    .querySelector('#property_me_externsion_popup_button')
    .addEventListener('dragstart', function(e) {
      e.dataTransfer.setData("application/my-app", e.target.id);
    });

  document
  .querySelector('body')
  .addEventListener('dragover', function(e) {
    document.querySelector('#property_me_externsion_popup_button').style.top = (e.clientY - 40) + 'px';
   });

  document
  .querySelector('#property_me_externsion_popup_button')
  .addEventListener('drop', function(e) {
    console.log(e);
   });
}
