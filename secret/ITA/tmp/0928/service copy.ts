import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs'
import { join } from 'path'
import { pipeline, Transform } from 'stream'

import { Injectable } from '@nestjs/common'
import * as mime from 'mime-types'
import * as sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import { LoggerService } from '@src/lib/logger/service'

import type { ReadStream } from 'fs-capacitor'

type ValidateType = 'IMAGE' | 'PDF'
type ResizeType = 'CUSTOMER_LOGO'

@Injectable()
export class StorageService {
  constructor(private readonly logger: LoggerService) {}

  /**
   * ファイルアップロードのメイン処理 \
   * imageファイルの場合にはSharpDuplexを適用するためvalidateにimageを必ず指定
   *
   * @param {string} [removeFilePath] 削除すべき元ファイルがある場合には必須
   * @param {string} [validate] mimetypeを検証する場合は必須
   * @param {string} [resize] SharpDuplexでresizeを適用する場合には必須
   */
  async putFile({
    createReadStream,
    mimetype,
    path,
    removeFilePath,
    validate,
    resize
  }: {
    createReadStream: () => ReadStream
    mimetype: string
    path: string
    removeFilePath?: string
    validate?: ValidateType
    resize?: ResizeType
  }): Promise<{
    path: string
    finish: () => void
    reset: () => void
  } | null> {
    if (
      validate &&
      !this.validateFileFromMimeType({
        validate,
        mimetype
      })
    ) {
      return null
    }
    const uploadPath = this.getUploadPath(path)
    const fileName = this.createFileName(
      validate === 'IMAGE' ? 'image/png' : mimetype
    )

    if (!fileName) {
      return null
    }

    const readStream = createReadStream()

    return new Promise((resolve) => {
      let duplex
      if (validate === 'IMAGE') {
        duplex = this.createSharpDuplex(resize)
      } else {
        duplex = this.createDefaultDuplex()
      }
      const writeStream = createWriteStream(`${uploadPath}/${fileName}`)
      pipeline(readStream, duplex, writeStream, (e) => {
        if (e) {
          this.deleteFile(
            `${uploadPath.replace(process.cwd() + '/', '')}/${fileName}`
          )
          this.logger.error(e.message)
          resolve(null)
        } else {
          resolve({
            path: `${uploadPath.replace(process.cwd() + '/', '')}/${fileName}`,
            finish: () => {
              if (removeFilePath) {
                this.deleteFile(removeFilePath)
              }
            },
            reset: () => {
              this.deleteFile(
                `${uploadPath.replace(process.cwd() + '/', '')}/${fileName}`
              )
            }
          })
        }
      })
    })
  }

  deleteFile(path: string) {
    // NOTE: 念の為uploadsディレクトリ配下しか削除させない
    if (!path.startsWith('uploads')) return

    const filePath = join(process.cwd(), path)
    if (existsSync(filePath)) unlinkSync(filePath)
  }

  private getUploadPath(individualPath: string): string {
    const joinedPath = `${join(process.cwd(), 'uploads', individualPath)}`
    if (process.env.NODE_ENV === 'development' && !existsSync(joinedPath)) {
      mkdirSync(joinedPath, {
        recursive: true
      })
    }
    return joinedPath
  }

  private createFileName(mimetype: string): string | false {
    let fileName = uuidv4()
    const extension = mime.extension(mimetype)
    if (!extension) {
      this.logger.warn(`Invalid Mimetype: ${mimetype}`)
      return false
    } else {
      fileName += `.${extension}`
    }
    return fileName
  }

  /**
   * 転送のみのダミーTransform
   */
  private createDefaultDuplex(): Transform {
    return new Transform({
      transform(data, _, callback) {
        callback(null, data)
      }
    })
  }

  private createSharpDuplex(resize?: ResizeType): sharp.Sharp {
    switch (resize) {
      case 'CUSTOMER_LOGO': {
        return sharp().resize(null, 120)
      }
      default: {
        return sharp().toFormat('png')
      }
    }
  }

  private validateFileFromMimeType({
    validate,
    mimetype
  }: {
    validate: ValidateType
    mimetype: string
  }): boolean {
    let result = false
    switch (validate) {
      case 'IMAGE': {
        result = mimetype.startsWith('image')
        break
      }
      case 'PDF': {
        result = mimetype === 'application/pdf'
        break
      }
      default: {
        result = true
      }
    }
    if (!result) {
      this.logger.warn(
        `Invalid File { validate: ${validate}, from ${mimetype} }`
      )
    }
    return result
  }
}
