function goToTopHtml() {
  const htmlTag = document.getElementsByTagName('html')[0];
  htmlTag.scrollTop = 0;
}

function goToTop() {
  const myDiv: HTMLElement | null = document.getElementById('page');
  if (myDiv) {
    myDiv.scrollTop = 0;
  }
}

const Dom = {
  goToTop,
  goToTopHtml,
};

export default Dom;
