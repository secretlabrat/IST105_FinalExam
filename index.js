let packagesList = [];

window.addEventListener("load", () => {
  renderTable();
});

function addPackage(e) {
  e.preventDefault();

  const nameElement = document.getElementById("recepient-name");
  const packageElement = document.getElementById("package-id");
  const deliveryAddressElement = document.getElementById("delivery-address");
  const weightElement = document.getElementById("weight");
  const resultTextElement = document.getElementById("result-text");
  resultTextElement.innerText = "";

  if (!nameElement.validity.valid) {
    if (nameElement.validity.valueMissing) {
      setErrorMessage(resultTextElement, "Recipient Name is required");
    }
    if (nameElement.validity.patternMismatch) {
      setErrorMessage(
        resultTextElement,
        "Recipient Name must be alphabetic characters only"
      );
    }
  } else if (!packageElement.validity.valid) {
    if (packageElement.validity.valueMissing) {
      setErrorMessage(resultTextElement, "Package ID is required");
    }
    if (packageElement.validity.patternMismatch) {
      setErrorMessage(resultTextElement, "Package ID must be integer only");
    }
  } else if (!deliveryAddressElement.validity.valid) {
    if (deliveryAddressElement.validity.valueMissing) {
      setErrorMessage(resultTextElement, "Delivery Address is required");
    }
  } else if (!weightElement.validity.valid) {
    if (weightElement.validity.valueMissing) {
      setErrorMessage(resultTextElement, "Weight is required");
    }
    if (weightElement.validity.patternMismatch) {
      setErrorMessage(resultTextElement, "Weight must be positive number only");
    }
    if (weightElement.validity.rangeUnderflow) {
      setErrorMessage(resultTextElement, "Weight must be at least 1 kg");
    }
  } else {
    const packageId = Number(packageElement.value);
    const weight = Number(weightElement.value);
    const trackingCode = generateTrackingCode(packageId, weight);
    const package = {
      name: nameElement.value,
      id: packageId,
      address: deliveryAddressElement.value,
      weight,
      trackingCode,
    };
    packagesList.push(package);
    resultTextElement.classList.remove("error");
    resultTextElement.classList.add("success");
    resultTextElement.innerText = `Package added successfully! Tracking Code: ${trackingCode}`;
    nameElement.value = "";
    packageElement.value = "";
    deliveryAddressElement.value = "";
    weightElement.value = "";
    renderTable();
  }
}

function setErrorMessage(elem, text) {
  elem.classList.remove("success");
  elem.classList.add("error");
  elem.innerText = text;
}

function generateTrackingCode(packageId, weight) {
  return ((packageId << 4) | weight).toString(2);
}

function renderTable() {
  packagesList = mergeSort(packagesList);
  const tableBodyElement = document.getElementById("packages-list-table");
  tableBodyElement.innerHTML = ``;
  packagesList.forEach((package) => {
    const rowElement = document.createElement("tr");
    rowElement.innerHTML = `<td>${package.name}</td><td>${package.id}</td><td>${package.address}</td><td>${package.weight}</td><td>${package.trackingCode}</td>`;
    tableBodyElement.appendChild(rowElement);
  });
}

function mergeSort(packages) {
  if (packages.length <= 1) return packages;

  const mid = Math.floor(packages.length / 2);
  const left = packages.slice(0, mid);
  const right = packages.slice(mid);

  const leftSorted = mergeSort(left);
  const rightSorted = mergeSort(right);

  return mergeHelper(leftSorted, rightSorted);
}

function mergeHelper(left, right) {
  const sortedList = [];
  let i = 0,
    j = 0;
  while (i < left.length && j < right.length) {
    if (left[i].weight < right[j].weight) {
      sortedList.push(left[i]);
      i++;
    } else {
      sortedList.push(right[j]);
      j++;
    }
  }
  return sortedList.concat(left.slice(i), right.slice(j));
}
