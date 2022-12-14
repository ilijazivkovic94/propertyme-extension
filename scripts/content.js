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
    if (document.querySelector('.img-circle.avatar-non-retina')) {
      insertButton();
    }
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
  const user_result = await fetch('https://app.propertyme.com/api/sec/user/profile?format=json', {
    method: 'GET',
  }).then(res => res.json());

  const inbox_result = await fetch('https://app.propertyme.com/api/comms/inboxitems?sEcho=1&iColumns=7&sColumns=%2C%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=50&mDataProp_0=Id&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=false&mDataProp_1=Status&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=LastMessageFrom&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=true&mDataProp_3=Subject&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=false&mDataProp_4=LotReference&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=Manager&sSearch_5=&bRegex_5=false&bSearchable_5=true&bSortable_5=true&mDataProp_6=LastMessageOn&sSearch_6=&bRegex_6=false&bSearchable_6=true&bSortable_6=true&sSearch=&bRegex=false&iSortCol_0=6&sSortDir_0=desc&iSortingCols=1&format=json', {
    method: 'GET',
  }).then(res => res.json());
  const inbox_filtered = inbox_result?.aaData?.filter(item => item.MemberId === user_result.MemberId);
  result.inbox = inbox_filtered ? inbox_filtered.length : 0;

  const outbox_result = await fetch('https://app.propertyme.com/api/comms/messages/list/Outbox/email?sEcho=1&iColumns=5&sColumns=%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=50&mDataProp_0=Id&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=false&mDataProp_1=RecipientName&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=Subject&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=false&mDataProp_3=MemberName&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=CreatedOn&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&sSearch=&bRegex=false&iSortCol_0=4&sSortDir_0=desc&iSortingCols=1&format=json', {
    method: 'GET',
  }).then(res => res.json());
  const filtered = outbox_result?.aaData?.filter(item => item.MemberId === user_result.MemberId);
  result.outbox = filtered ? filtered.length : 0;

  const bills_result = await fetch('https://app.propertyme.com/api/financial/bills/status/draft?sEcho=1&iColumns=12&sColumns=%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=50&mDataProp_0=Id&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=false&mDataProp_1=Number&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=SupplierContactReference&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=true&mDataProp_3=LotReference&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=Reference&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=Manager&sSearch_5=&bRegex_5=false&bSearchable_5=true&bSortable_5=true&mDataProp_6=Priority&sSearch_6=&bRegex_6=false&bSearchable_6=true&bSortable_6=true&mDataProp_7=DueDate&sSearch_7=&bRegex_7=false&bSearchable_7=true&bSortable_7=true&mDataProp_8=Detail&sSearch_8=&bRegex_8=false&bSearchable_8=true&bSortable_8=true&mDataProp_9=Document&sSearch_9=&bRegex_9=false&bSearchable_9=true&bSortable_9=false&mDataProp_10=IsTaxed&sSearch_10=&bRegex_10=false&bSearchable_10=true&bSortable_10=true&mDataProp_11=Amount&sSearch_11=&bRegex_11=false&bSearchable_11=true&bSortable_11=true&sSearch=&bRegex=false&iSortCol_0=1&sSortDir_0=asc&iSortingCols=1&format=json', {
    method: 'GET',
  }).then(res => res.json());
  const bills_filtered = bills_result?.aaData?.filter(item => item.Manager === user_result.DisplayName);
  result.bills = bills_filtered ? bills_filtered.length : 0;

  console.log(encodeURIComponent(JSON.stringify(result)));
  return encodeURIComponent(JSON.stringify(result));
}

async function getInvoicesCount() {
  const invoice_result = await fetch('https://app.propertyme.com/api/financial/invoices?status=pending&ToFolioId=aeb404fa-464a-ff3e-b770-06927a2dad34&sEcho=1&iColumns=9&sColumns=%2C%2C%2C%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=50&mDataProp_0=Number&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=true&mDataProp_1=DueDate&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=Id&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=false&mDataProp_3=ChartAccount&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=Description&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=DocumentStorageId&sSearch_5=&bRegex_5=false&bSearchable_5=true&bSortable_5=true&mDataProp_6=IsTaxed&sSearch_6=&bRegex_6=false&bSearchable_6=true&bSortable_6=true&mDataProp_7=Amount&sSearch_7=&bRegex_7=false&bSearchable_7=true&bSortable_7=true&mDataProp_8=PaidAmount&sSearch_8=&bRegex_8=false&bSearchable_8=true&bSortable_8=true&sSearch=&bRegex=false&iSortCol_0=1&sSortDir_0=asc&iSortingCols=1&format=json', {
    method: 'GET',
  }).then(res => res.json());
  console.log(invoice_result);
}

async function insertButton() {
  let showHome = false;
  const url = encodeURIComponent(window.location.href);

  let count_result = await getMessagesCount();
  getInvoicesCount();
  
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
    const linkAry = window.location.href.split('lotId=');
    properties += linkAry[linkAry.length - 1] + '::';
  }
  if (window.location.href.indexOf('/portal-access/folio-invites/') > -1) {
    const linkAry = window.location.href.split('lotId=');
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
  const directory_url = chrome.runtime.getURL("/extension/build/show_directory.html");
  const logo = chrome.runtime.getURL("/extension/public/images/logo.png");
  const close = chrome.runtime.getURL("/extension/public/images/close.svg");

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
  
  let drive_modal = document.createElement("div");
  drive_modal.setAttribute("id", "property_me_externsion_drive_modal");
  drive_modal.setAttribute("draggable", "true");
  drive_modal.innerHTML = `
    <div id="property_me_extension_modal_dialog">
      <div id="property_me_extension_modal_close_btn">
        <img src="${close}"  />
      </div>
      <iframe id="property_me_extension_modal_iframe" />
    </div>
  `;
  
  mask.innerHTML += drive_modal.outerHTML;
  document.body.appendChild(mask);

  var eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  var eventer = window[eventMethod];
  var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  // Listen to message from child window
  eventer(
    messageEvent,
    async function (e) {
      console.log("parent received message!:  ", e.data);
      if (e.data.type === 'open') {
        window.open(e.data.link, '_blank');
      }
      if (e.data.type === 'invoice') {
        const detail = e.data.detail;
        let invoice_result = [];
        if (window.location.href.indexOf('/folio/tenant/') > -1) {
          invoice_result = await fetch('https://app.propertyme.com/api/financial/invoices?status=pending&ToFolioId=' + detail.Tenancy.FolioId + '&sEcho=1&iColumns=9&sColumns=%2C%2C%2C%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=50&mDataProp_0=Number&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=true&mDataProp_1=DueDate&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=Id&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=false&mDataProp_3=ChartAccount&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=Description&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=DocumentStorageId&sSearch_5=&bRegex_5=false&bSearchable_5=true&bSortable_5=true&mDataProp_6=IsTaxed&sSearch_6=&bRegex_6=false&bSearchable_6=true&bSortable_6=true&mDataProp_7=Amount&sSearch_7=&bRegex_7=false&bSearchable_7=true&bSortable_7=true&mDataProp_8=PaidAmount&sSearch_8=&bRegex_8=false&bSearchable_8=true&bSortable_8=true&sSearch=&bRegex=false&iSortCol_0=1&sSortDir_0=asc&iSortingCols=1&format=json', {
            method: 'GET',
          }).then(res => res.json());
          invoice_result = invoice_result ? invoice_result.aaData : [];
        } else {
          invoice_result = await fetch('https://app.propertyme.com/api/financial/invoices?status=pending&FromFolioId=' + detail.Ownership.FolioId + '&sEcho=1&iColumns=9&sColumns=%2C%2C%2C%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=50&mDataProp_0=Number&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=true&mDataProp_1=DueDate&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=Id&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=false&mDataProp_3=ChartAccount&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=Description&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=DocumentStorageId&sSearch_5=&bRegex_5=false&bSearchable_5=true&bSortable_5=true&mDataProp_6=IsTaxed&sSearch_6=&bRegex_6=false&bSearchable_6=true&bSortable_6=true&mDataProp_7=Amount&sSearch_7=&bRegex_7=false&bSearchable_7=true&bSortable_7=true&mDataProp_8=PaidAmount&sSearch_8=&bRegex_8=false&bSearchable_8=true&bSortable_8=true&sSearch=&bRegex=false&iSortCol_0=1&sSortDir_0=asc&iSortingCols=1&format=json', {
            method: 'GET',
          }).then(res => res.json());
          invoice_result = invoice_result ? invoice_result.aaData : [];
        }
        const child_window = document.querySelector('#property_me_extension_content_iframe').contentWindow;
        child_window.postMessage({
          type: 'invoice_result',
          data: invoice_result,
          id: detail.Id,
        }, "*")
      }
      if (e.data.type === 'modal') {
        document.querySelector('#property_me_externsion_drive_modal #property_me_extension_modal_iframe').src = directory_url + '?timestamp=' + new Date().getTime() + '&link=' + encodeURIComponent(e.data.link);
        document.querySelector('#property_me_externsion_drive_modal').style.display = 'block';
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
        const linkAry = window.location.href.split('lotId=');
        properties += linkAry[linkAry.length - 1] + '::';
      }
      if (window.location.href.indexOf('/portal-access/folio-invites/') > -1) {
        const linkAry = window.location.href.split('lotId=');
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

  document
    .querySelector('#property_me_extension_modal_close_btn')
    .addEventListener('click', function() {
      document.querySelector('#property_me_externsion_drive_modal #property_me_extension_modal_iframe').src = '';
      document.querySelector('#property_me_externsion_drive_modal').style.display = 'none';
    })
}
