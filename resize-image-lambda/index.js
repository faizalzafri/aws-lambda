const im = require("imagemagick");
const fs = require("fs");
const os = require("os");
const uuid = require("uuid").v4;
const { promisify } = require("util");
const AWS = require("aws-sdk");

const resizeAsync = promisify(im.resize);
const readAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

AWS.config.update({ region: "us-east-2" });
const s3 = new AWS.S3();

exports.handler = async (event) => {
  let filesUploaded = event.Records.map(async (record) => {
    let bucket = record.s3.bucket.name;
    let filename = record.s3.object.key;

    // retrieve file
    var params = {
      Bucket: bucket,
      Key: filename,
    };
    let inputdata = await s3.getObject(params).promise();

    //resize
    let tempFile = os.tmpdir() + "/" + uuid() + ".jpg";

    let resizeArgs = {
      srcData: inputdata,
      dstpath: tempFile,
      width: 150,
      height: 0,
    };
    await resizeAsync(resizeArgs);

    //read resized file
    let resizedData = await readAsync(tempFile);

    //put file back
    let targetFilename =
      filename.substring(0, filename.indexOf(".")) + "-small.jpg";

    var params = {
      Bucket: bucket,
      Key: targetFilename,
      Body: Buffer.from(resizedData),
      ContentType: "image/jpeg",
    };
    await s3.putObject(params).promise();
    return await unlinkAsync(tempFile);
  });

  await Promise.all(filesUploaded);
  console.log("complete");
  return "done";
};
