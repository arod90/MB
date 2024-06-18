import AWS from 'aws-sdk';

const S3 = new AWS.S3({
  region: process.env.NEXT_PUBLIC_S3_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  const data = await S3.upload(params).promise();
  return data.Location;
};
