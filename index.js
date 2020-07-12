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

  let message = `${greeting[lang] ? greeting[lang] : greeting[en]}, ${name}`;

  let response = {
    message: message,
    params: params,
    timestamp: new Date().toUTCString,
  };

    return {
        statusCode: 200,
        body: JSON.stringify(response);
  };
};
