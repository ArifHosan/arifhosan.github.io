interface Language {
  _id: string;
  title: string;
  file_name: string;
  language_name: string;
  created_at: Date;
}

interface Status {
  id: number;
  description: string;
}

interface Result {
  stdout: string;
  time: number;
  memory: number;
  stderr: string;
  token: string;
  compile_output: string;
  message: string;
  status: Status;
}

interface Snippet {

  _id?: number;
  url?: string;
  code: string;
  stdin: string;
  language: Language;
  uuid: string;
}
