import { Request, Response, NextFunction } from 'express'
import { config } from 'node-config-ts'
import { getCustomRepository } from 'typeorm'
import { BaseCtrl } from './BaseCtrl'
import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'

export class UploadsCtrl extends BaseCtrl {
  protected s3: S3
  constructor() {
    super()
    this.s3 = new S3({
      accessKeyId: config.s3.accessKey,
      secretAccessKey: config.s3.secretKey
    })
  }

  async index(req: Request, res: Response, next: NextFunction) {
    const upload = await this.uploadFile(req.file)
    res.send(upload)
  }

  uploadFile (file) {
    return new Promise((resolve, reject) => {
      this.s3.upload({
        Key: file.originalname.replace(/\s+/g, '-').toLowerCase(),
        Bucket: config.s3.bucket,
        ACL: 'public-read',
        ContentType: file.mimetype,
        Body: fs.createReadStream(file.path)
      }, (err, output) => {
        if (err) {
          reject(err)
          return
        }
        resolve(output)
      })
    })
  }

}
