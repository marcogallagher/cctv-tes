exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: 'Env variable belum di-set' })
      };
    }

    const { lat, lng } = JSON.parse(event.body);
    if (lat === undefined || lng === undefined) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Lokasi kosong' }) };
    }

    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendLocation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        latitude: lat,
        longitude: lng
      })
    });

    const tgResult = await tgResponse.json();

    if (!tgResult.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ ok: false, error: tgResult.description || 'Telegram API error' })
      };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message })
    };
  }
};
