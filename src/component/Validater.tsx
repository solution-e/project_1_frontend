export default function defaultValidation (object:string) {
    var ErrorsMessage = "";
    if(!object) {
        ErrorsMessage = '文字を入力してください'
    }
    return ErrorsMessage;
}