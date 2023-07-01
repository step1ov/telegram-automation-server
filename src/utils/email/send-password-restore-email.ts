import SendEmail from './send-email';

const SendPasswordRestoreEmail = async (
  receiverAddress: string,
  emailEncrypted: string,
  code: string,
) => {
  const link = `${process.env.ADMIN_PANEL_URL}/restore-password/${emailEncrypted}/${code}`;
  return SendEmail(
    receiverAddress,
    'BETALIFE. Ваш пароль для входа в аккаунт',
    `Задравствуйте,
Для восстановления пароля в панели администрирования BETALIFE перейдите по ссылке:
${link}
Команда BETALIFE`,
    `<p>Задравствуйте!</p>
<p>Для восстановления пароля в панели администрирования <strong>BETALIFE</strong> перейдите по ссылке:</p>
<p><a href="${link}">${link}</a></p>
<p>С уважением,<br> Команда <b>BETALIFE</b></p>`,
  );
};

export default SendPasswordRestoreEmail;
