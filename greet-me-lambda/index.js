const greeting = {
  en: "Hello",
  fr: "Bonjour",
  hi: "Namaste",
  es: "Hola",
  pt: "Ola",
};

exports.handler = async (event) => {
  let name = event.pathParameters.name;
  let { language, ...params } = event.queryStringParameters;

  let message = `${
    greeting[language] ? greeting[language] : greeting["en"]
  }, ${name}`;

  let greetings = {
    message: message,
    params: params,
    timestamp: new Date().toUTCString,
  };

  const response = {
    statusCode: 200,
    boody: JSON.stringify(greetings),
  };

  return response;
};
