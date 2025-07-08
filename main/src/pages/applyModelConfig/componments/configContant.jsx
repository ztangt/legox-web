export const defaultAttAuth=()=>{
  return (
    [
      {
        "formColumnCode": "REL_FILE",
        "authType": '',
        "authScope": "NONE",
        "formColumnName": "关联平台内文件",
        "authScopeId": null,
        "authScopeName": null,
        "isRequired":null,
        "type":"ASSOCIATED"
      },
      {
        "formColumnCode": "UPLOAD_FILE",
        "authType": "",
        "authScope": "NONE",
        "formColumnName": "附件",
        "authScopeId": null,
        "authScopeName": null,
        "isRequired":null,
        "type":"ASSOCIATED"
      }
    ]
  )
}