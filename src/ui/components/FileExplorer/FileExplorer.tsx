type Props = {
    files: File[];
    folders: Folder[]
}

const FileExplorer: React.FC<Props> = ({files, folders}) => {
    console.log( files, folders);
    return (
        <div>
            {files.map(file => (
                <a>{file.name}</a>
            ))}
        </div>
    )
}

export default FileExplorer;