// on Desktop Search Focus Show Overlay And Result
const desktopSearchFocus = () => {
  document.getElementById("desktopSearchResult").classList.remove("hidden");
  document
    .getElementById("desktopSearchResultOverlay")
    .classList.remove("hidden");
  document
    .getElementById("desktopSearchInputWrapper")
    .classList.add("!bg-muted", "!border-primary");
};


document.getElementById("desktopSearchInput").addEventListener("focus",desktopSearchFocus );

// on Desktop Search Focus Hide Overlay And Result
const desktopSearchUnFocus = () => {
  document.getElementById("desktopSearchResult").classList.add("hidden");
  document.getElementById("desktopSearchResultOverlay").classList.add("hidden");

  document
    .getElementById("desktopSearchInputWrapper")
    .classList.remove("!bg-muted", "!border-primary");
};
document.getElementById("desktopSearchResultOverlay").addEventListener("click",desktopSearchUnFocus );

// on Desktop Search Type Toggle Clear Button Base on Value
const desktopSearchOnType = (e) => {
  if (e.target.value.length > 0) {
    // Show Clear Button
    document.getElementById("desktopSearchClearButton").classList.add("flex");
    document
      .getElementById("desktopSearchClearButton")
      .classList.remove("hidden");
  } else {
    // Hide Clear Button
    document
      .getElementById("desktopSearchClearButton")
      .classList.remove("flex");
    document.getElementById("desktopSearchClearButton").classList.add("hidden");
  }
};
document.getElementById("desktopSearchInput").addEventListener("keyup",desktopSearchOnType);

// Clear Desktop Search Input value
const desktopSearchClearValue = () => {
  document.getElementById("desktopSearchInput").value = "";
  // Hide Clear Button
  document.getElementById("desktopSearchClearButton").classList.remove("flex");
  document.getElementById("desktopSearchClearButton").classList.add("hidden");
};
document.getElementById("desktopSearchClearButton").addEventListener("click",desktopSearchOnType);

// Mobile Section

// on Moblie Search Focus Hide Overlay And Result
const mobileSearchOnFocus = () => {
  document
    .getElementById("headerMobileNavigation")
    .classList.add("-translate-y-full");
  document.getElementById("headerMobileTop").classList.add("-translate-y-full");
  document
    .getElementById("headerMobileSearchCloseIcon")
    .classList.add("!w-6", "!h-6", "ml-2");

  document
    .getElementById("headerMobileSearchResult")
    .classList.remove("hidden");

  //  lock Page Scroll

  document.documentElement.classList.add("overflow-hidden");
};
const mobileSearchUnFocus = () => {
  document
    .getElementById("headerMobileNavigation")
    .classList.remove("-translate-y-full");
  document
    .getElementById("headerMobileTop")
    .classList.remove("-translate-y-full");
  document
    .getElementById("headerMobileSearchCloseIcon")
    .classList.remove("!w-6", "!h-6", "ml-2");

  document.getElementById("headerMobileSearchResult").classList.add("hidden");

  //  unlock Page Scroll
  document.documentElement.classList.remove("overflow-hidden");
};
document.getElementById("headerMobileSearchCloseIcon").addEventListener("click",mobileSearchUnFocus );

// on Mobile Search Type Toggle Clear Button Base on Value
const mobileSearchOnType = (e) => {
  if (e.target.value.length > 0) {
    // Show Clear Button
    document.getElementById("mobileSearchClearButton").classList.add("flex");
    document
      .getElementById("mobileSearchClearButton")
      .classList.remove("hidden");
  } else {
    // Hide Clear Button
    document.getElementById("mobileSearchClearButton").classList.remove("flex");
    document.getElementById("mobileSearchClearButton").classList.add("hidden");
  }
};
document.getElementById("mobileSearchInput").addEventListener("keyup",mobileSearchOnType);
document.getElementById("mobileSearchInput").addEventListener("focus",mobileSearchOnFocus );

// Clear Desktop Search Input value
const mobileSearchClearValue = () => {
  document.getElementById("mobileSearchInput").value = "";
  // Hide Clear Button
  document.getElementById("mobileSearchClearButton").classList.remove("flex");
  document.getElementById("mobileSearchClearButton").classList.add("hidden");
};
document.getElementById("mobileSearchClearButton").addEventListener("click",mobileSearchClearValue );
