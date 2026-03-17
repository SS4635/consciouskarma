import cron from "node-cron";
import { runDailyApiMonitor } from "./apiMonitor.js";

export function startMonitorCron({ sendEmail, processInstantReport }) {
  const timezone = process.env.CRON_TIMEZONE || "Asia/Kolkata";

  cron.schedule(
    "0 17 * * *",
    async () => {
      console.log("🕘 Starting daily API monitor cron...");
      try {
        const results = await runDailyApiMonitor({
          sendEmail,
          processInstantReport,
        });
        console.log("✅ Daily monitor completed");
        console.log(JSON.stringify(results, null, 2));
      } catch (err) {
        console.error("❌ Daily monitor cron failed:", err.message);

        try {
          await sendEmail({
            to: process.env.MONITOR_TO_EMAIL,
            subject: "Daily API Monitor Cron Failed",
            html: `
              <div style="font-family:Arial,sans-serif">
                <h2>Monitor Cron Failed</h2>
                <p><strong>Error:</strong> ${String(err.message || err)}</p>
              </div>
            `,
          });
        } catch (mailErr) {
          console.error("❌ Failed to send cron failure mail:", mailErr.message);
        }
      }
    },
    { timezone }
  );

  console.log(`✅ Monitor cron scheduled for 9 PM daily (${timezone})`);
}