import { Writable } from 'stream';
import { createWriteStream } from 'fs';

export class ArrayCsvWriterStream extends Writable {

	writer;
	fields = [];

	constructor(options = {}) {
		super({
			...options,
			objectMode: true
		});
		this.fields = options.fields;
		this.writer = createWriteStream(options.filePath);
		this.writeHeader();
	}

	writeHeader() {
		this.writer.write(this.fields.map(field => field).join(','));
		this.writer.write('\n');
	}

	_write(chunk, encoding, callback) {
		const parsedChunk = this.parseChunk(chunk) + '\n';
		this.writer.write(parsedChunk, callback);
	}

	parseChunk(chunk) {
		return this.fields.map(field => chunk[field]).join(',');
	}

	_writev(chunks, callback) {
		this.writer.write(chunks.map(({ chunk }) => this.parseChunk(chunk)).join('\n') + '\n', callback);
	}
}
