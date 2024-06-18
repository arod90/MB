import AWS from 'aws-sdk';
import { NextResponse } from 'next/server';

const s3 = new AWS.S3({
  region: process.env.NEXT_PUBLIC_S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(req) {
  try {
    // const s3Params = {
    //   Bucket: process.env.S3_BUKCET_NAME,
    // };
    // const signedUrl = await s3.getSignedUrlPromise('putObject');
    const { file, name, type } = await req.json();
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: `${Date.now()}_${name}`,
      Expires: 60,
      Body: Buffer.from(file, 'base64'),
      ContentType: type,
    };

    const data = await s3.upload(params).promise();
    // const data = await s3.put;

    return NextResponse.json({ url: data.Location });
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
