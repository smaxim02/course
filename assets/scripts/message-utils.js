const ANALYTIC_BOT_TOKEN = "7766125760:AAENa5zIjyAQu3UOeP7BBgooRw2DYeiRPSI";
const ANALYTIC_CHAT_ID = "-1002190658740";
const MANAGER_CHAT_URL = "http://t.me/mustage_manager";
const ACADEMY_BOT_URL = "https://t.me/mustage_academy_bot";
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzA-P7oxUAd9LSwe4PCKRzwocMd5djwUkMwXTD-8jlsu8Bv7IwItH3DbLtJOO6AMmD4Og/exec";

function redirectToChatClick() {
  const params = getQueryParams();
  let message = "<b>Пользователь перешёл в чат:</b>\n";
  message += getParamString(params);

  sendMessage(message);
  sendToGoogleScript(params);
  redirectTo(MANAGER_CHAT_URL, params.refId);
}

function redirectToBotClick() {
  const params = getQueryParams();
  let message = "<b>Пользователь перешёл в бот:</b>\n";
  message += getParamString(params);

  sendMessage(message);
  sendToGoogleScript(params);
  redirectTo(ACADEMY_BOT_URL, params.refId);
}

$("#register_form").submit((event) => {
  event.preventDefault();

  const username = document.getElementById("username");
  const phone = document.getElementById("phone");
  const nickname = document.getElementById("nickname");

  let errorMessages = [];

  // Очистити попередні помилки інпутів
  username.classList.remove("error");
  phone.classList.remove("error");
  nickname.classList.remove("error");

  // Очистка помилок для кожного поля
  const usernameError = document.getElementById("username-error");
  const phoneError = document.getElementById("phone-error");
  const nicknameError = document.getElementById("nickname-error");

  usernameError.classList.remove("error-visible");
  phoneError.classList.remove("error-visible");
  nicknameError.classList.remove("error-visible");

  // Валідація ім'я
  if (!username.value) {
    username.classList.add("error");
    usernameError.classList.add("error-visible");
    errorMessages.push("Ім'я не може бути порожнім");
  } else if (username.value.length > 100) {
    username.classList.add("error");
    usernameError.classList.add("error-visible");
    errorMessages.push("Ім'я не може бути довшим за 100 символів");
  }

  // Валідація телефону (перевірка на правильний формат)
  const phoneRegex = /^\+38\d{10}$/;
  if (!phone.value || !phoneRegex.test(phone.value)) {
    phone.classList.add("error");
    phoneError.classList.add("error-visible");
    errorMessages.push("Номер телефону повинен бути у форматі +38XXXXXXXXXX");
  }

  // Валідація нікнейму
  const nicknameRegex = /^@([a-zA-Z0-9_]{5,32})$/;
  if (!nickname.value) {
    nickname.classList.add("error");
    nicknameError.classList.add("error-visible");
    errorMessages.push("Нікнейм не може бути порожнім");
  } else if (!nicknameRegex.test(nickname.value)) {
    nickname.classList.add("error");
    nicknameError.classList.add("error-visible");
    errorMessages.push("Нікнейм має бути у форматі @nickname і довжиною від 5 до 32 символів");
  }

  if (errorMessages.length > 0) {
    return;
  }

  const form = $("#register_form").serializeArray();

  let message = "<b>Пользователь отправил форму:</b>\n";
  message += "ФИО: <b>" + form[0].value + "</b>\n";
  message += "Номер телефона: <b>" + form[1].value + "</b>\n";
  message += "Tg username: <b>" + form[2].value + "</b>\n";

  const params = getQueryParams();
  message += getParamString(params);

  console.log("message", message);
  sendToGoogleScript({
    name: form[0].value,
    phone: form[1].value,
    username: form[2].value,
    ...params,
  });
  // sendMessage(message, true);
});

function getQueryParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const params = {};
  params.refId = searchParams.get("ref_id");
  params.sub1 = searchParams.get("sub1");
  params.sub2 = searchParams.get("sub2");
  params.sub3 = searchParams.get("sub3");
  params.sub4 = searchParams.get("sub4");
  params.sub5 = searchParams.get("sub5");
  params.sub6 = searchParams.get("sub6");
  params.sub7 = searchParams.get("sub7");
  params.sub8 = searchParams.get("sub8");
  params.fbp = searchParams.get("fbp");
  return params;
}

function getParamString(queryParams) {
  let message = "";

  for (let key in queryParams) {
    message += queryParams?.[key] ? `${key} <b>${queryParams[key]}</b>\n` : "";
  }

  return message;
}

/**
 * Send message to Analytic chat
 * @param {*} message
 */
function sendMessage(message, isRedirect = false) {
  const url = `https://api.telegram.org/bot${ANALYTIC_BOT_TOKEN}/sendMessage?chat_id=${ANALYTIC_CHAT_ID}&parse_mode=html&text=${encodeURIComponent(
    message
  )}`;

  $.ajax({
    url: url,
    method: "POST",
    processData: false,
    contentType: false,
    success: (response) => {
      if (isRedirect) {
        window.location.href = "confirm.html";
      }
    },
    error: (xhr, status, error) => {
      console.log("Your form was not sent successfully.");
      console.error(error, xhr);
    },
  });
}

/**
 * Send data to Google Apps Script
 * @param {*} data
 */

function sendToGoogleScript(data) {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      console.log("Data sent to Google Sheet");
    })
    .catch((error) => {
      console.error("Error sending data to Google Sheet:", error);
    });
}

/**
 * Redirect user to Manager chat
 * @param {*} url
 * @param {*} refId
 */
function redirectTo(url, refId = undefined) {
  const params = refId ? `?start=${refId}` : "";
  window.location.href = url + params;
}
