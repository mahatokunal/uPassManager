import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '[REDACTED]' : 'Not Found');
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '[REDACTED]' : 'Not Found');
    console.log('AWS_REGION:', process.env.AWS_REGION || 'us-east-2');

    const lambda = new LambdaClient({ 
      region: process.env.AWS_REGION || process.env.NEXT_PUBLIC_AWS_REGION || "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
      }
    });

    const { email, distributorName, setPasswordLink } = req.body;

    if (!email || !setPasswordLink) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const message = `
Hi ${distributorName},

Welcome to the U-Pass Portal!

Please set your password using the link below:

${setPasswordLink}

If you have any questions, feel free to reach out.

Thanks,  
U-Pass Management
`;

    const payload = {
      recipients: [email],
      subject: "Set Up Your Password - U-Pass Portal",
      message: message,
    };

    console.log('📦 Payload prepared:', JSON.stringify(payload));

    const command = new InvokeCommand({
      FunctionName: "CS5934_G6_SES",
      InvocationType: "RequestResponse",
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    const response = await lambda.send(command);

    console.log('Lambda invoked successfully! Raw response:', response);

    const responsePayload = JSON.parse(new TextDecoder().decode(response.Payload));

    if (responsePayload.statusCode !== 200) {
      throw new Error(responsePayload.body ? JSON.parse(responsePayload.body).error : 'Lambda function failed');
    }

    res.status(200).json({ success: true, message: "Distributor notified successfully." });

  } catch (err) {
    console.error('Error in notify-new-distributor:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}
