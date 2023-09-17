const asideEl = document.querySelector("aside");
const inputEl = document.querySelector("input");
const btnListEl = document.querySelector('.btn-list')

const btnList = [];

asideEl.addEventListener("click", function (e) {
  if (e.target.matches("button")) {

    if (e.target.matches(".search") && !inputEl.value) {
      return;
    } else if (!e.target.matches(".search") && e.target.matches("button")) {
        inputEl.value = e.target.textContent
    }
    
    btnListEl.textContent = ''
    btnList.push(inputEl.value);
    showBtnList()
  }
});

const showBtnList = () => {
  const uniqBtnList = [...new Set(btnList)];
  uniqBtnList.forEach((btn) => {
    const btnEl = document.createElement("button");
    btnEl.textContent = btn;
    btnListEl.append(btnEl);
  });
};


