interface Language {
    _id: String,
    title: String,
    file_name: String,
    language_name: String,
    created_at: Date
}

interface Status {
    id: number,
    description: String
}

interface Result {
    stdout: String,
    time: number,
    memory: number,
    stderr: String,
    token: String,
    compile_output: String,
    message: String,
    status: Status
}