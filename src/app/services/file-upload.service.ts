import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../model/FileUpload';
import { Book } from '../model/book';
import { Author } from '../model/author';
import { Quote } from '../model/quote';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private basePath = '/uploads';

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
  ) { }

  pushFileToStorageBook(fileUpload: FileUpload, book: Book) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    uploadTask.then(() => {
      storageRef.getDownloadURL().subscribe(downloadURL => {
        fileUpload.url = downloadURL;
        fileUpload.name = fileUpload.file.name;
        this.saveFileDataToFireStoreBook(fileUpload, book);
      });
    });
    return uploadTask.percentageChanges();
  }

  private saveFileDataToFireStoreBook(fileUpload: FileUpload, book: Book): void {
    book.cover = fileUpload.url;
    // this.dataService.createBook(book);
  }


  pushFileToStorageAuthor(fileUpload: FileUpload, author: Author) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    uploadTask.then(() => {
      storageRef.getDownloadURL().subscribe(downloadURL => {
        fileUpload.url = downloadURL;
        fileUpload.name = fileUpload.file.name;
        this.saveFileDataToFireStoreAuthor(fileUpload, author);
      });
    });
    return uploadTask.percentageChanges();
  }

  private saveFileDataToFireStoreAuthor(fileUpload: FileUpload, author: Author): void {
    author.cover = fileUpload.url;
    // this.dataService.createAuthor(author);
  }


  pushFileToStorageQuote(fileUpload: FileUpload, quote: Quote) {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);
    uploadTask.then(() => {
      storageRef.getDownloadURL().subscribe(downloadURL => {
        fileUpload.url = downloadURL;
        fileUpload.name = fileUpload.file.name;
        this.saveFileDataToFireStoreQuote(fileUpload, quote);
      });
    });
    return uploadTask.percentageChanges();
  }

  private saveFileDataToFireStoreQuote(fileUpload: FileUpload, quote: Quote): void {
    quote.cover = fileUpload.url;
    // this.dataService.createQuote(quote);
  }

  // getFiles(numberItems: number): AngularFireList<FileUpload> {
  //   return this.db.list(this.basePath, ref =>
  //     ref.limitToLast(numberItems));
  // }

  deleteFile(fileUpload: FileUpload): void {
    this.deleteFileDatabase(fileUpload.key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name);
      })
      .catch(error => console.log(error));
  }

  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }

  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
