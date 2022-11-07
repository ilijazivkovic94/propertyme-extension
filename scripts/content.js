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

insertButton();

function insertButton() {
    const url = window.location.href;

    const page_url = chrome.runtime.getURL("/extension/build/index.html");
    const logo = chrome.runtime.getURL("/extension/public/images/logo.png");

    const mask = document.createElement("div");
    mask.setAttribute("id", "property_me_externsion_container");
    const modal = document.createElement("div");
    modal.setAttribute("id", "property_me_externsion_popup_button");

    modal.innerHTML = `
        <div id="property_me_extension_header">
            <img src="${logo}" id="property_me_extension_header_toggle" />
            <div id="property_me_externsion_avatar" style="display: none;">
                TC
            </div>
        </div>
        <div id="property_me_extension_content" style="display: none;">
            <iframe src="${page_url}" id="property_me_extension_content_iframe" />
        </div>
    `;

    mask.innerHTML = modal.outerHTML;
    document.body.appendChild(mask);

    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
      console.log('parent received message!:  ',e.data);
      document.getElementById('property_me_extension_content_iframe').height = e.data + 'px';
    },false);

    document
      .querySelector("#property_me_extension_header_toggle")
      .addEventListener("click", () => {
        const avatar = document.querySelector('#property_me_externsion_avatar');
        avatar.style.display = avatar.style.display === 'none' ? "flex" : 'none';

        document.querySelector('#property_me_extension_header').style.borderBottom = avatar.style.display === 'none' ? "none" : '1px solid green';
        document.querySelector('#property_me_extension_header').style.paddingBottom = avatar.style.display === 'none' ? "0px" : '5px';
        document.querySelector('#property_me_extension_header').style.marginBottom = avatar.style.display === 'none' ? "0px" : '5px';
        const content = document.querySelector('#property_me_extension_content');
        content.style.display = content.style.display === 'none' ? "block" : 'none';
      })
}