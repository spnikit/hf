export const DaDataConfig = {
  url: "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party",
  token: "1d58cdb7fa6830962103f5e97c7daa5a5cac5f0f",
  query: "",
  options: {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token "
    }
  },
  body: JSON.stringify({ query: "" })
};
DaDataConfig.options.headers.Authorization = "Token " + DaDataConfig.token;

const DomformUi = {
  party: document.querySelector("#party"),
  shortName: document.querySelector("#name_short"),
  fullName: document.querySelector("#name_full"),
  innKpp: document.querySelector("#inn_kpp"),
  addressFull: document.querySelector("#address"),

  update(model) {
    Object.keys(DomformUi).forEach((key) => {
      DomformUi[key].value = model[key];
    });
  }
};

export const model = {
  party: "",
  shortName: "",
  fullName: "",
  innKpp: "",
  addressFull: "",

  update(dataObj) {
    Object.keys(model).forEach((key) => (model[key] = dataObj[key]));
  }
};

export const controller = {
  updateModel(data) {
    model.update(data);
  },

  updateUi(ui, model) {
    ui.update(model);
    console.log("process");
  },

  registerEvent(node, event, callback) {
    node.addEventListener(event, callback);
  }
};

// controller.registerEvent(DomformUi.innKpp, "keyup", (event) => {
//   event.stopPropagation();
//   event.stopImmediatePropagation();
//   if (event.code !== "Enter") {
//     return;
//   }

//   const inn = event.target.value.trim();

//   const { options, url } = DaDataConfig;

//   const optionsToSend = { ...options, body: JSON.stringify({ query: inn }) };

//   fetch(url, optionsToSend)
//     .then((response) => response.json())
//     .then((result) => processResult(result))
//     .catch((error) => console.log("error", error));
// });

export function processResult(result) {
  if (!result && result.suggestions instanceof Array) {
    throw new Error("result object is not found!");
  }

  const {
    value: shortName,

    data: {
      name: { full_with_opf: fullName },
      inn,
      kpp,
      address: { unrestricted_value: addressFull }
    }
  } = result.suggestions[0];

  const dataObj = {
    party: shortName,
    shortName,
    fullName,
    addressFull,
    innKpp: `${inn} / ${kpp}`
  };

  return dataObj;
}
