const urlParams = window.location.href.split('&link=');
const link = urlParams[1];
if (link) {
  setTimeout(() => {
    document.querySelector('#file_container').src = decodeURIComponent(link);
    document.querySelector('#file_container').style.display = 'block';
    document.querySelector('.loading-container').style.display = 'none';
  }, 1000);
}