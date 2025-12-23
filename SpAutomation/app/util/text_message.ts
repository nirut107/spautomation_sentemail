export function getText(title: string, orders: string[]): string {
  function renderOrdersAsHtml(orders: string[]) {
    let html = "";
    let inSubList = false;

    orders.forEach((item) => {
      if (item.startsWith("-")) {
        if (!inSubList) {
          html += "<ul style='margin-top:6px;padding-left:18px;'>";
          inSubList = true;
        }
        html += `<li>${item.replace(/^-+/, "").trim()}</li>`;
      } else {
        if (inSubList) {
          html += "</ul></li>";
          inSubList = false;
        }
        html += `<li style="margin-bottom:6px;">${item}`;
      }
    });

    if (inSubList) {
      html += "</ul></li>";
    }

    return html;
  }

  function setBody() {
    if (title == "Invoice") {
      return `
            <p style="font-weight:bold;margin-top:16px;">
              Payment Information
            </p>

            <p>
              Please find our bank account details below for payment.
            </p>

            <p>
              For your convenience, the bank book image is attached for reference.
            </p>
 `;
    }

    if (title == "TaxInvoice/Receipt") {
      return `
        <p style="font-weight:bold;margin-top:16px;">
          Payment Confirmation
        </p>

        <p>
          This document serves as confirmation that payment has been received.
        </p>

        <p>
          Thank you very much for your payment and continued support.
        </p>
        `;
    }
    return `
              <p style="margin-top:0;">
                Dear Customer,
              </p>

              <p>
                Please find the attached document for your reference.
              </p>

              <p style="font-weight:bold;margin-bottom:8px;">
                Document Details:
              </p>

              <p>${renderOrdersAsHtml(orders)}</p>

              <p>
                If you have any questions or require further information, please feel free to contact us.
              </p>

              <p style="margin-bottom:0;">
                Thank you for your kind support.
              </p>
            `;
  }
  let message = "";
  const htmlMessage = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:20px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#0f172a;color:#ffffff;padding:20px;">
              <h2 style="margin:0;font-size:20px;">${title}</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;color:#333333;">
            ${setBody()}
            </td>
          </tr>
          <!-- Body -->
          

          <!-- Footer -->
          <tr>
            <td style="background-color:#f1f5f9;padding:16px;color:#555555;font-size:13px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="140" align="center" valign="middle">
                    <img
                      src="cid:logo"
                      alt="SP Automation"
                      style="max-width:120px;display:block;"
                    />
                  </td>
                  <td valign="middle" style="padding-left:10px;">
                    <strong>SP Automation and Software Engineer Co., Ltd.</strong><br />
                    276/36 Phetkasam 4, Watthapra, Bangkokyai, Bangkok 10600<br />
                    Tel: 097-453-5296<br />
                    Email: sp.automationsoftware.co@gmail.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
  return htmlMessage;
}
