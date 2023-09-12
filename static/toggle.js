const iconWrapper = document.querySelector('#icon-wrapper');
const headerIconsList = document.querySelectorAll('.gauge__icon');
const wrapperNodeList = document.querySelectorAll('.wrapper');

iconWrapper.addEventListener('click', () => {
  headerIconsList.forEach(icon => icon.classList.toggle('hidden'))
  wrapperNodeList.forEach(wrapper => {
    wrapper.classList.toggle('hidden');
    wrapper.classList.toggle('visible');
  })
})

