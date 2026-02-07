// AUTO-GENERATED. DO NOT EDIT.
// Source: tools/gen-actions.cjs
// Inputs: src/spec/parametersets.json

export type HwpActionName =
  | "ActionCrossRef"
  | "AddHanjaWord"
  | "AppState"
  | "AutoFill"
  | "AutoNum"
  | "Bibliography"
  | "BibliographyAll"
  | "BibliographyName"
  | "BlogAccount"
  | "BlogUpload"
  | "BookMark"
  | "BorderFill"
  | "BorderFillExt"
  | "BrailleConvert"
  | "BulletShape"
  | "CCLMark"
  | "Caption"
  | "CaptureEnd"
  | "Cell"
  | "CellBorderFill"
  | "CertDRM"
  | "ChCompose"
  | "ChComposeShapes"
  | "ChangeRome"
  | "ChangeRomeUser"
  | "CharShape"
  | "ChartObjShape"
  | "CodeTable"
  | "ColDef"
  | "CommPermission"
  | "CompatibleDocument"
  | "ConvertCase"
  | "ConvertFullHalf"
  | "ConvertHiraToGata"
  | "ConvertJianFan"
  | "ConvertToHangul"
  | "CtrlData"
  | "DeleteCtrls"
  | "DeletePage"
  | "DocDRM"
  | "DocData"
  | "DocFilters"
  | "DocFindInfo"
  | "DocumentFilterDialog"
  | "DocumentInfo"
  | "DrawArcType"
  | "DrawConnectLine"
  | "DrawCoordInfo"
  | "DrawCtrlHyperlink"
  | "DrawEditDetail"
  | "DrawFillAttr"
  | "DrawImageAttr"
  | "DrawImageScissoring"
  | "DrawLayOut"
  | "DrawLineAttr"
  | "DrawObjTemplateSave"
  | "DrawRectType"
  | "DrawResize"
  | "DrawRotate"
  | "DrawScAction"
  | "DrawShadow"
  | "DrawShear"
  | "DrawSoEquationOption"
  | "DrawSoMouseOption"
  | "DrawTextBox"
  | "DrawTextart"
  | "DrawVideoAttr"
  | "DropCap"
  | "Dutmal"
  | "EngineProperties"
  | "EqEdit"
  | "ExchangeFootnoteEndNote"
  | "FieldCtrl"
  | "FileConvert"
  | "FileInfo"
  | "FileOpen"
  | "FileOpenSave"
  | "FileSaveAs"
  | "FileSaveBlock"
  | "FileSaveDaisy"
  | "FileSecurity"
  | "FileSendMail"
  | "FileSetSecurity"
  | "FileXMLSchema"
  | "FindImagePath"
  | "FindReplace"
  | "FlashProperties"
  | "FootnoteShape"
  | "FormButtonAttr"
  | "FormCharshapeattr"
  | "FormComboboxAttr"
  | "FormCommonAttr"
  | "FormEditAttr"
  | "FormGeneral"
  | "FormListBoxAttr"
  | "FormObjHanjaBusu"
  | "FormObjHanjaMean"
  | "FormObjInputCodeTable"
  | "FormObjInputHanja"
  | "FormObjInputIdiom"
  | "FormScrollbarAttr"
  | "FtpUpload"
  | "GetText"
  | "GotoE"
  | "GridInfo"
  | "HeaderFooter"
  | "HncMessageBox"
  | "HtmlPlusExport"
  | "HyperLink"
  | "HyperlinkJump"
  | "Idiom"
  | "IndexMark"
  | "InputDateStyle"
  | "InputHanja"
  | "InputHanjaBusu"
  | "InputHanjaMean"
  | "InsertFieldTemplate"
  | "InsertFile"
  | "InsertText"
  | "Internet"
  | "KeyMacro"
  | "Label"
  | "LinkDocument"
  | "ListParaPos"
  | "ListProperties"
  | "LoadUserInfoFile"
  | "LunarToSolar"
  | "MailMergeGenerate"
  | "MakeContents"
  | "MarkpenShape"
  | "MasterPage"
  | "MemoShape"
  | "MessageSet"
  | "MetaData"
  | "MetaTag"
  | "MousePos"
  | "MovieProperties"
  | "NumberingShape"
  | "OleCreation"
  | "PageBorderFill"
  | "PageDef"
  | "PageHiding"
  | "PageNumCtrl"
  | "PageNumPos"
  | "ParaShape"
  | "Password"
  | "PasteHtml"
  | "PictureChange"
  | "PluginCreation"
  | "Preference"
  | "Presentation"
  | "PresentationRange"
  | "Print"
  | "PrintToImage"
  | "PrintWatermark"
  | "PrivateInfoSecurity"
  | "PronounceInfo"
  | "QCorrect"
  | "RWPassword"
  | "RangeTagShape"
  | "RevisionDef"
  | "SaveAsImage"
  | "SaveFootnote"
  | "SaveUserInfoFile"
  | "ScriptMacro"
  | "ScrollPosInfo"
  | "SearchAddress"
  | "SearchForeign"
  | "SecDef"
  | "SectionApply"
  | "SectionMasterPage"
  | "SelectionOpt"
  | "ShapeCopyPaste"
  | "ShapeGuideLine"
  | "ShapeObjComment"
  | "ShapeObjSaveAsPicture"
  | "ShapeObject"
  | "ShapeObjectCopyPaste"
  | "SolarToLunar"
  | "Sort"
  | "SpellingCheck"
  | "Style"
  | "StyleDelete"
  | "StyleItem"
  | "StyleTemplate"
  | "Sum"
  | "SummaryInfo"
  | "TabDef"
  | "Table"
  | "TableBorderFill"
  | "TableChartInfo"
  | "TableCreation"
  | "TableDeleteLine"
  | "TableDrawPen"
  | "TableInsertLine"
  | "TableSplitCell"
  | "TableStrToTbl"
  | "TableSwap"
  | "TableTblToStr"
  | "TableTemplate"
  | "TextCtrl"
  | "TextVertical"
  | "TrackChange"
  | "TransTranslate"
  | "UserQCommandFile"
  | "VersionInfo"
  | "VfsAuthentication"
  | "ViewProperties"
  | "ViewStatus"
  | "XMLOpenSave"
  | "XMLSchema"
  | "XSecurity"
  ;

export type HwpActionSpec = {
  action: HwpActionName;
  /** HParameterSet runtime id (e.g. HInsertText) */
  runtimeId: string;
  title: string;
};

export const HWP_ACTIONS: Record<HwpActionName, HwpActionSpec> = {
  "ActionCrossRef": { action: "ActionCrossRef", runtimeId: "HActionCrossRef", title: "상호참조 삽입" },
  "AddHanjaWord": { action: "AddHanjaWord", runtimeId: "HAddHanjaWord", title: "AddHanjaWord" },
  "AppState": { action: "AppState", runtimeId: "HAppState", title: "AppState" },
  "AutoFill": { action: "AutoFill", runtimeId: "HAutoFill", title: "자동 채우기" },
  "AutoNum": { action: "AutoNum", runtimeId: "HAutoNum", title: "번호 넣기" },
  "Bibliography": { action: "Bibliography", runtimeId: "HBibliography", title: "Bibliography" },
  "BibliographyAll": { action: "BibliographyAll", runtimeId: "HBibliographyAll", title: "BibliographyAll" },
  "BibliographyName": { action: "BibliographyName", runtimeId: "HBibliographyName", title: "BibliographyName" },
  "BlogAccount": { action: "BlogAccount", runtimeId: "HBlogAccount", title: "BlogAccount" },
  "BlogUpload": { action: "BlogUpload", runtimeId: "HBlogUpload", title: "BlogUpload" },
  "BookMark": { action: "BookMark", runtimeId: "HBookMark", title: "책갈피" },
  "BorderFill": { action: "BorderFill", runtimeId: "HBorderFill", title: "테두리/배경의 일반 속성" },
  "BorderFillExt": { action: "BorderFillExt", runtimeId: "HBorderFillExt", title: "UI 구현을 위한 BorderFill 확장BorderFillExt는 BorderFill로부터 계승받았으므로 위 표에 정리된 BorderFillExt의 아이템들 이외에 BorderFill의 아이템들을 사용할 수 있다." },
  "BrailleConvert": { action: "BrailleConvert", runtimeId: "HBrailleConvert", title: "점자 변환" },
  "BulletShape": { action: "BulletShape", runtimeId: "HBulletShape", title: "불릿 모양(글머리표 모양)" },
  "CCLMark": { action: "CCLMark", runtimeId: "HCCLMark", title: "CCLMark" },
  "Caption": { action: "Caption", runtimeId: "HCaption", title: "캡션 속성" },
  "CaptureEnd": { action: "CaptureEnd", runtimeId: "HCaptureEnd", title: "갈무리 끝갈무리 때 코어엔진에서 액션에게 보내는 정보(시작/끝점의 좌표). 내부에서만 사용된다." },
  "Cell": { action: "Cell", runtimeId: "HCell", title: "셀Cell은 ListProperties로부터 계승받았으므로 위 표에 정리된 Cell의 아이템들 이외에 ListProperties의 아이템들을 사용할 수 있다." },
  "CellBorderFill": { action: "CellBorderFill", runtimeId: "HCellBorderFill", title: "셀 테두리/배경CellBorderFill은 BorderFillExt로부터 계승받았으므로 위 표에 정리된 CellBorderFill의 아이템들 이외에 BorderFillExt의 아이템들을 사용할 수 있다." },
  "CertDRM": { action: "CertDRM", runtimeId: "HCertDRM", title: "CertDRM" },
  "ChCompose": { action: "ChCompose", runtimeId: "HChCompose", title: "글자 겹침" },
  "ChComposeShapes": { action: "ChComposeShapes", runtimeId: "HChComposeShapes", title: "글자 겹치기 글자 속성셋" },
  "ChangeRome": { action: "ChangeRome", runtimeId: "HChangeRome", title: "로마자 변환" },
  "ChangeRomeUser": { action: "ChangeRomeUser", runtimeId: "HChangeRomeUser", title: "ChangeRomeUser" },
  "CharShape": { action: "CharShape", runtimeId: "HCharShape", title: "글자 모양" },
  "ChartObjShape": { action: "ChartObjShape", runtimeId: "HChartObjShape", title: "ChartObjShape" },
  "CodeTable": { action: "CodeTable", runtimeId: "HCodeTable", title: "문자표" },
  "ColDef": { action: "ColDef", runtimeId: "HColDef", title: "단 정의 속성" },
  "CommPermission": { action: "CommPermission", runtimeId: "HCommPermission", title: "CommPermission" },
  "CompatibleDocument": { action: "CompatibleDocument", runtimeId: "HCompatibleDocument", title: "호환 문서" },
  "ConvertCase": { action: "ConvertCase", runtimeId: "HConvertCase", title: "대/소문자 변환" },
  "ConvertFullHalf": { action: "ConvertFullHalf", runtimeId: "HConvertFullHalf", title: "전/반각 변환" },
  "ConvertHiraToGata": { action: "ConvertHiraToGata", runtimeId: "HConvertHiraToGata", title: "히라가나/가타가나 변환" },
  "ConvertJianFan": { action: "ConvertJianFan", runtimeId: "HConvertJianFan", title: "간/번체 변환" },
  "ConvertToHangul": { action: "ConvertToHangul", runtimeId: "HConvertToHangul", title: "한자, 일어, 구결을 한글로" },
  "CtrlData": { action: "CtrlData", runtimeId: "HCtrlData", title: "컨트롤 데이터컨트롤 데이터. 컨트롤에 임의로 설정할 수 있는 데이터 셋. 기본적으로 서브셋을 사용하는 것을 원칙으로 한다." },
  "DeleteCtrls": { action: "DeleteCtrls", runtimeId: "HDeleteCtrls", title: "조판 부호 컨트롤 지우기" },
  "DeletePage": { action: "DeletePage", runtimeId: "HDeletePage", title: "쪽 지우기  글2007" },
  "DocDRM": { action: "DocDRM", runtimeId: "HDocDRM", title: "DocDRM" },
  "DocData": { action: "DocData", runtimeId: "HDocData", title: "DocData" },
  "DocFilters": { action: "DocFilters", runtimeId: "HDocFilters", title: "Document 필터 리스트" },
  "DocFindInfo": { action: "DocFindInfo", runtimeId: "HDocFindInfo", title: "문서 찾기" },
  "DocumentFilterDialog": { action: "DocumentFilterDialog", runtimeId: "HDocumentFilterDialog", title: "DocumentFilterDialog" },
  "DocumentInfo": { action: "DocumentInfo", runtimeId: "HDocumentInfo", title: "문서에 대한 정보" },
  "DrawArcType": { action: "DrawArcType", runtimeId: "HDrawArcType", title: "그리기 개체의 부채꼴 테두리 모양" },
  "DrawConnectLine": { action: "DrawConnectLine", runtimeId: "HDrawConnectLine", title: "DrawConnectLine" },
  "DrawCoordInfo": { action: "DrawCoordInfo", runtimeId: "HDrawCoordInfo", title: "그리기 개체의 좌표 정보정보를 얻을 때만 사용하도록 한다." },
  "DrawCtrlHyperlink": { action: "DrawCtrlHyperlink", runtimeId: "HDrawCtrlHyperlink", title: "그리기 개체의 Hyperlink 정보" },
  "DrawEditDetail": { action: "DrawEditDetail", runtimeId: "HDrawEditDetail", title: "그리기 개체의 다각형 편집" },
  "DrawFillAttr": { action: "DrawFillAttr", runtimeId: "HDrawFillAttr", title: "그리기 개체의 채우기 속성" },
  "DrawImageAttr": { action: "DrawImageAttr", runtimeId: "HDrawImageAttr", title: "그림 개체 속성그림 개체의 속성을 지정하기 위한 파라메터셋.DrawFillAttr에서 그림과 관련된 속성만 빼서 파라메터셋으로 지정되었다.현재 DrawFillAttr와 상속관계가 지정되지 않았다. (차후 상속관계로 묶일 예정)" },
  "DrawImageScissoring": { action: "DrawImageScissoring", runtimeId: "HDrawImageScissoring", title: "그림 개체의 자르기 정보" },
  "DrawLayOut": { action: "DrawLayOut", runtimeId: "HDrawLayOut", title: "그리기 개체의 Layout" },
  "DrawLineAttr": { action: "DrawLineAttr", runtimeId: "HDrawLineAttr", title: "그리기 개체의 선 속성" },
  "DrawObjTemplateSave": { action: "DrawObjTemplateSave", runtimeId: "HDrawObjTemplateSave", title: "DrawObjTemplateSave" },
  "DrawRectType": { action: "DrawRectType", runtimeId: "HDrawRectType", title: "사각형 모서리 모양" },
  "DrawResize": { action: "DrawResize", runtimeId: "HDrawResize", title: "그리기 개체 Resizing 정보" },
  "DrawRotate": { action: "DrawRotate", runtimeId: "HDrawRotate", title: "그리기 개체 회전 정보" },
  "DrawScAction": { action: "DrawScAction", runtimeId: "HDrawScAction", title: "그리기 개체 90도 회전 및 좌우/상하 뒤집기" },
  "DrawShadow": { action: "DrawShadow", runtimeId: "HDrawShadow", title: "그리기 개체 그림자 정보" },
  "DrawShear": { action: "DrawShear", runtimeId: "HDrawShear", title: "그리기 개체 기울이기 정보" },
  "DrawSoEquationOption": { action: "DrawSoEquationOption", runtimeId: "HDrawSoEquationOption", title: "DrawSoEquationOption" },
  "DrawSoMouseOption": { action: "DrawSoMouseOption", runtimeId: "HDrawSoMouseOption", title: "DrawSoMouseOption" },
  "DrawTextBox": { action: "DrawTextBox", runtimeId: "HDrawTextBox", title: "DrawTextBox" },
  "DrawTextart": { action: "DrawTextart", runtimeId: "HDrawTextart", title: "글맵시 속성" },
  "DrawVideoAttr": { action: "DrawVideoAttr", runtimeId: "HDrawVideoAttr", title: "DrawVideoAttr" },
  "DropCap": { action: "DropCap", runtimeId: "HDropCap", title: "문단 첫 글자 장식" },
  "Dutmal": { action: "Dutmal", runtimeId: "HDutmal", title: "덧말" },
  "EngineProperties": { action: "EngineProperties", runtimeId: "HEngineProperties", title: "환경 설정 옵션HwpCtrl의 EngineProperties에서 사용된다. 해당 액션은 존재하지 않음" },
  "EqEdit": { action: "EqEdit", runtimeId: "HEqEdit", title: "수식EqEdit는 ShapeObject로부터 계승받았으므로 위 표에 정리된 EqEdit의 아이템들 이외에 ShapeObject의 아이템들을 사용할 수 있다." },
  "ExchangeFootnoteEndNote": { action: "ExchangeFootnoteEndNote", runtimeId: "HExchangeFootnoteEndNote", title: "각주/미주 변환" },
  "FieldCtrl": { action: "FieldCtrl", runtimeId: "HFieldCtrl", title: "필드 컨트롤의 공통 데이터" },
  "FileConvert": { action: "FileConvert", runtimeId: "HFileConvert", title: "여러 파일을 동시에 특정 포맷으로 변환하여 저장 (관련 Action/API 존재하지 않음)" },
  "FileInfo": { action: "FileInfo", runtimeId: "HFileInfo", title: "파일 정보HwpCtrl.GetFileInfo에서 사용, 해당 액션은 존재하지 않음." },
  "FileOpen": { action: "FileOpen", runtimeId: "HFileOpen", title: "파일 오픈" },
  "FileOpenSave": { action: "FileOpenSave", runtimeId: "HFileOpenSave", title: "FileOpenSave" },
  "FileSaveAs": { action: "FileSaveAs", runtimeId: "HFileSaveAs", title: "파일 저장FileOpen과 멤버가 동일" },
  "FileSaveBlock": { action: "FileSaveBlock", runtimeId: "HFileSaveBlock", title: "블록 지정된 부분을 저장" },
  "FileSaveDaisy": { action: "FileSaveDaisy", runtimeId: "HFileSaveDaisy", title: "FileSaveDaisy" },
  "FileSecurity": { action: "FileSecurity", runtimeId: "HFileSecurity", title: "FileSecurity" },
  "FileSendMail": { action: "FileSendMail", runtimeId: "HFileSendMail", title: "메일 보내기" },
  "FileSetSecurity": { action: "FileSetSecurity", runtimeId: "HFileSetSecurity", title: "배포용 문서" },
  "FileXMLSchema": { action: "FileXMLSchema", runtimeId: "HFileXMLSchema", title: "FileXMLSchema" },
  "FindImagePath": { action: "FindImagePath", runtimeId: "HFindImagePath", title: "FindImagePath" },
  "FindReplace": { action: "FindReplace", runtimeId: "HFindReplace", title: "찾기/찾아 바꾸기" },
  "FlashProperties": { action: "FlashProperties", runtimeId: "HFlashProperties", title: "플래시 파일 삽입 시 필요한 옵션" },
  "FootnoteShape": { action: "FootnoteShape", runtimeId: "HFootnoteShape", title: "FootnoteShape" },
  "FormButtonAttr": { action: "FormButtonAttr", runtimeId: "HFormButtonAttr", title: "FormButtonAttr" },
  "FormCharshapeattr": { action: "FormCharshapeattr", runtimeId: "HFormCharshapeattr", title: "FormCharshapeattr" },
  "FormComboboxAttr": { action: "FormComboboxAttr", runtimeId: "HFormComboboxAttr", title: "FormComboboxAttr" },
  "FormCommonAttr": { action: "FormCommonAttr", runtimeId: "HFormCommonAttr", title: "FormCommonAttr" },
  "FormEditAttr": { action: "FormEditAttr", runtimeId: "HFormEditAttr", title: "FormEditAttr" },
  "FormGeneral": { action: "FormGeneral", runtimeId: "HFormGeneral", title: "FormGeneral" },
  "FormListBoxAttr": { action: "FormListBoxAttr", runtimeId: "HFormListBoxAttr", title: "FormListBoxAttr" },
  "FormObjHanjaBusu": { action: "FormObjHanjaBusu", runtimeId: "HFormObjHanjaBusu", title: "FormObjHanjaBusu" },
  "FormObjHanjaMean": { action: "FormObjHanjaMean", runtimeId: "HFormObjHanjaMean", title: "FormObjHanjaMean" },
  "FormObjInputCodeTable": { action: "FormObjInputCodeTable", runtimeId: "HFormObjInputCodeTable", title: "FormObjInputCodeTable" },
  "FormObjInputHanja": { action: "FormObjInputHanja", runtimeId: "HFormObjInputHanja", title: "FormObjInputHanja" },
  "FormObjInputIdiom": { action: "FormObjInputIdiom", runtimeId: "HFormObjInputIdiom", title: "FormObjInputIdiom" },
  "FormScrollbarAttr": { action: "FormScrollbarAttr", runtimeId: "HFormScrollbarAttr", title: "FormScrollbarAttr" },
  "FtpUpload": { action: "FtpUpload", runtimeId: "HFtpUpload", title: "웹서버로 올리기" },
  "GetText": { action: "GetText", runtimeId: "HGetText", title: "GetText" },
  "GotoE": { action: "GotoE", runtimeId: "HGotoE", title: "찾아가기" },
  "GridInfo": { action: "GridInfo", runtimeId: "HGridInfo", title: "격자 정보" },
  "HeaderFooter": { action: "HeaderFooter", runtimeId: "HHeaderFooter", title: "머리말/꼬리말" },
  "HncMessageBox": { action: "HncMessageBox", runtimeId: "HHncMessageBox", title: "HncMessageBox" },
  "HtmlPlusExport": { action: "HtmlPlusExport", runtimeId: "HHtmlPlusExport", title: "HtmlPlusExport" },
  "HyperLink": { action: "HyperLink", runtimeId: "HHyperLink", title: "하이퍼링크 삽입 / 고치기" },
  "HyperlinkJump": { action: "HyperlinkJump", runtimeId: "HHyperlinkJump", title: "하이퍼링크 이동" },
  "Idiom": { action: "Idiom", runtimeId: "HIdiom", title: "상용구" },
  "IndexMark": { action: "IndexMark", runtimeId: "HIndexMark", title: "찾아보기 표식" },
  "InputDateStyle": { action: "InputDateStyle", runtimeId: "HInputDateStyle", title: "날짜/시간 표시 형식" },
  "InputHanja": { action: "InputHanja", runtimeId: "HInputHanja", title: "InputHanja" },
  "InputHanjaBusu": { action: "InputHanjaBusu", runtimeId: "HInputHanjaBusu", title: "InputHanjaBusu" },
  "InputHanjaMean": { action: "InputHanjaMean", runtimeId: "HInputHanjaMean", title: "InputHanjaMean" },
  "InsertFieldTemplate": { action: "InsertFieldTemplate", runtimeId: "HInsertFieldTemplate", title: "상호 참조 넣기" },
  "InsertFile": { action: "InsertFile", runtimeId: "HInsertFile", title: "파일 삽입" },
  "InsertText": { action: "InsertText", runtimeId: "HInsertText", title: "텍스트 삽입" },
  "Internet": { action: "Internet", runtimeId: "HInternet", title: "Internet" },
  "KeyMacro": { action: "KeyMacro", runtimeId: "HKeyMacro", title: "키매크로" },
  "Label": { action: "Label", runtimeId: "HLabel", title: "라벨" },
  "LinkDocument": { action: "LinkDocument", runtimeId: "HLinkDocument", title: "문서 연결" },
  "ListParaPos": { action: "ListParaPos", runtimeId: "HListParaPos", title: "커서의 위치HwpCtrl.GetPosBySet. SetPosBySet, HwpCtrlCode.GetAnchorPos에서 사용, 해당 액션은 존재하지 않음." },
  "ListProperties": { action: "ListProperties", runtimeId: "HListProperties", title: "서브 리스트의 속성" },
  "LoadUserInfoFile": { action: "LoadUserInfoFile", runtimeId: "HLoadUserInfoFile", title: "LoadUserInfoFile" },
  "LunarToSolar": { action: "LunarToSolar", runtimeId: "HLunarToSolar", title: "LunarToSolar" },
  "MailMergeGenerate": { action: "MailMergeGenerate", runtimeId: "HMailMergeGenerate", title: "메일 머지 만들기" },
  "MakeContents": { action: "MakeContents", runtimeId: "HMakeContents", title: "차례 만들기" },
  "MarkpenShape": { action: "MarkpenShape", runtimeId: "HMarkpenShape", title: "형광펜 모양" },
  "MasterPage": { action: "MasterPage", runtimeId: "HMasterPage", title: "바탕쪽" },
  "MemoShape": { action: "MemoShape", runtimeId: "HMemoShape", title: "메모 모양" },
  "MessageSet": { action: "MessageSet", runtimeId: "HMessageSet", title: "MessageSet" },
  "MetaData": { action: "MetaData", runtimeId: "HMetaData", title: "MetaData" },
  "MetaTag": { action: "MetaTag", runtimeId: "HMetaTag", title: "MetaTag" },
  "MousePos": { action: "MousePos", runtimeId: "HMousePos", title: "마우스 위치HwpCtrl.GetMousePos에서 사용, 해당 액션은 존재하지 않음." },
  "MovieProperties": { action: "MovieProperties", runtimeId: "HMovieProperties", title: "동영상 파일 삽입 시 필요한 옵션" },
  "NumberingShape": { action: "NumberingShape", runtimeId: "HNumberingShape", title: "NumberingShape" },
  "OleCreation": { action: "OleCreation", runtimeId: "HOleCreation", title: "OLE 개체 생성" },
  "PageBorderFill": { action: "PageBorderFill", runtimeId: "HPageBorderFill", title: "구역의 쪽 테두리/배경PageBorderFill은 BorderFill로부터 계승받았으므로 위 표에 정리된 PageBorderFill의 아이템들 이외에 BorderFill의 아이템들을 사용할 수 있다." },
  "PageDef": { action: "PageDef", runtimeId: "HPageDef", title: "구역 내의 용지 설정 속성" },
  "PageHiding": { action: "PageHiding", runtimeId: "HPageHiding", title: "감추기" },
  "PageNumCtrl": { action: "PageNumCtrl", runtimeId: "HPageNumCtrl", title: "페이지번호 (97의 홀수 쪽에서 시작)CtrlCode.Properties에서 사용된다." },
  "PageNumPos": { action: "PageNumPos", runtimeId: "HPageNumPos", title: "쪽 번호 위치" },
  "ParaShape": { action: "ParaShape", runtimeId: "HParaShape", title: "문단 모양" },
  "Password": { action: "Password", runtimeId: "HPassword", title: "문서 암호" },
  "PasteHtml": { action: "PasteHtml", runtimeId: "HPasteHtml", title: "PasteHtml" },
  "PictureChange": { action: "PictureChange", runtimeId: "HPictureChange", title: "그림 바꾸기" },
  "PluginCreation": { action: "PluginCreation", runtimeId: "HPluginCreation", title: "PluginCreation" },
  "Preference": { action: "Preference", runtimeId: "HPreference", title: "환경 설정" },
  "Presentation": { action: "Presentation", runtimeId: "HPresentation", title: "프레젠테이션" },
  "PresentationRange": { action: "PresentationRange", runtimeId: "HPresentationRange", title: "문서 전체 프레젠테이션 설정" },
  "Print": { action: "Print", runtimeId: "HPrint", title: "인쇄" },
  "PrintToImage": { action: "PrintToImage", runtimeId: "HPrintToImage", title: "그림으로 저장" },
  "PrintWatermark": { action: "PrintWatermark", runtimeId: "HPrintWatermark", title: "워터마크 속성" },
  "PrivateInfoSecurity": { action: "PrivateInfoSecurity", runtimeId: "HPrivateInfoSecurity", title: "개인 정보 보안" },
  "PronounceInfo": { action: "PronounceInfo", runtimeId: "HPronounceInfo", title: "한자/일어 발음 표시" },
  "QCorrect": { action: "QCorrect", runtimeId: "HQCorrect", title: "빠른 교정" },
  "RWPassword": { action: "RWPassword", runtimeId: "HRWPassword", title: "RWPassword" },
  "RangeTagShape": { action: "RangeTagShape", runtimeId: "HRangeTagShape", title: "RangeTagShape" },
  "RevisionDef": { action: "RevisionDef", runtimeId: "HRevisionDef", title: "교정부호 데이터" },
  "SaveAsImage": { action: "SaveAsImage", runtimeId: "HSaveAsImage", title: "바이너리 그림을 다른 형태로 저장하는 옵션을 설정" },
  "SaveFootnote": { action: "SaveFootnote", runtimeId: "HSaveFootnote", title: "주석 저장" },
  "SaveUserInfoFile": { action: "SaveUserInfoFile", runtimeId: "HSaveUserInfoFile", title: "SaveUserInfoFile" },
  "ScriptMacro": { action: "ScriptMacro", runtimeId: "HScriptMacro", title: "스크립트 매크로" },
  "ScrollPosInfo": { action: "ScrollPosInfo", runtimeId: "HScrollPosInfo", title: "ScrollPosInfo" },
  "SearchAddress": { action: "SearchAddress", runtimeId: "HSearchAddress", title: "SearchAddress" },
  "SearchForeign": { action: "SearchForeign", runtimeId: "HSearchForeign", title: "SearchForeign" },
  "SecDef": { action: "SecDef", runtimeId: "HSecDef", title: "구역의 속성" },
  "SectionApply": { action: "SectionApply", runtimeId: "HSectionApply", title: "적용할 구역 설정" },
  "SectionMasterPage": { action: "SectionMasterPage", runtimeId: "HSectionMasterPage", title: "SectionMasterPage" },
  "SelectionOpt": { action: "SelectionOpt", runtimeId: "HSelectionOpt", title: "SelectionOpt" },
  "ShapeCopyPaste": { action: "ShapeCopyPaste", runtimeId: "HShapeCopyPaste", title: "모양 복사" },
  "ShapeGuideLine": { action: "ShapeGuideLine", runtimeId: "HShapeGuideLine", title: "ShapeGuideLine" },
  "ShapeObjComment": { action: "ShapeObjComment", runtimeId: "HShapeObjComment", title: "개체 설명문개체 설명문" },
  "ShapeObjSaveAsPicture": { action: "ShapeObjSaveAsPicture", runtimeId: "HShapeObjSaveAsPicture", title: "ShapeObjSaveAsPicture" },
  "ShapeObject": { action: "ShapeObject", runtimeId: "HShapeObject", title: "그리기 개체의 공통 속성 (도형, 글상자, 표, 그림 등)ShapeObject는 글의 컨트롤 중 편집영역을 자연스럽게 이동할 수 있는 개체를 말한다. 일반적으로 이런 개체들은 선택했을 때" },
  "ShapeObjectCopyPaste": { action: "ShapeObjectCopyPaste", runtimeId: "HShapeObjectCopyPaste", title: "그리기 개체 모양 복사/붙여 넣기" },
  "SolarToLunar": { action: "SolarToLunar", runtimeId: "HSolarToLunar", title: "SolarToLunar" },
  "Sort": { action: "Sort", runtimeId: "HSort", title: "소트" },
  "SpellingCheck": { action: "SpellingCheck", runtimeId: "HSpellingCheck", title: "SpellingCheck" },
  "Style": { action: "Style", runtimeId: "HStyle", title: "스타일" },
  "StyleDelete": { action: "StyleDelete", runtimeId: "HStyleDelete", title: "스타일 지우기" },
  "StyleItem": { action: "StyleItem", runtimeId: "HStyleItem", title: "스타일 - 바로 편집하기 대화상자" },
  "StyleTemplate": { action: "StyleTemplate", runtimeId: "HStyleTemplate", title: "스타일 마당" },
  "Sum": { action: "Sum", runtimeId: "HSum", title: "블록 계산 (합계/평균/줄 수)" },
  "SummaryInfo": { action: "SummaryInfo", runtimeId: "HSummaryInfo", title: "문서 정보" },
  "TabDef": { action: "TabDef", runtimeId: "HTabDef", title: "탭 정의" },
  "Table": { action: "Table", runtimeId: "HTable", title: "표Table은 ShapeObject로부터 계승받았으므로 위 표에 정리된 Table의 아이템들 이외에 ShapeObject의 아이템들을 사용할 수 있다." },
  "TableBorderFill": { action: "TableBorderFill", runtimeId: "HTableBorderFill", title: "TableBorderFill" },
  "TableChartInfo": { action: "TableChartInfo", runtimeId: "HTableChartInfo", title: "TableChartInfo" },
  "TableCreation": { action: "TableCreation", runtimeId: "HTableCreation", title: "표 생성" },
  "TableDeleteLine": { action: "TableDeleteLine", runtimeId: "HTableDeleteLine", title: "표의 줄/칸 삭제" },
  "TableDrawPen": { action: "TableDrawPen", runtimeId: "HTableDrawPen", title: "마우스로 테이블을 그릴 때 쓰이는 펜" },
  "TableInsertLine": { action: "TableInsertLine", runtimeId: "HTableInsertLine", title: "표의 줄/칸 삽입" },
  "TableSplitCell": { action: "TableSplitCell", runtimeId: "HTableSplitCell", title: "셀 나누기" },
  "TableStrToTbl": { action: "TableStrToTbl", runtimeId: "HTableStrToTbl", title: "문자열을 표로" },
  "TableSwap": { action: "TableSwap", runtimeId: "HTableSwap", title: "표 뒤집기" },
  "TableTblToStr": { action: "TableTblToStr", runtimeId: "HTableTblToStr", title: "표를 문자열로" },
  "TableTemplate": { action: "TableTemplate", runtimeId: "HTableTemplate", title: "표 마당 정보" },
  "TextCtrl": { action: "TextCtrl", runtimeId: "HTextCtrl", title: "TEXT 컨트롤의 공통 데이터CtrlCode.Properties에서 사용된다." },
  "TextVertical": { action: "TextVertical", runtimeId: "HTextVertical", title: "세로쓰기" },
  "TrackChange": { action: "TrackChange", runtimeId: "HTrackChange", title: "변경 추적" },
  "TransTranslate": { action: "TransTranslate", runtimeId: "HTransTranslate", title: "TransTranslate" },
  "UserQCommandFile": { action: "UserQCommandFile", runtimeId: "HUserQCommandFile", title: "사용자 자동 명령 파일 저장/로드" },
  "VersionInfo": { action: "VersionInfo", runtimeId: "HVersionInfo", title: "버전 정보" },
  "VfsAuthentication": { action: "VfsAuthentication", runtimeId: "HVfsAuthentication", title: "VfsAuthentication" },
  "ViewProperties": { action: "ViewProperties", runtimeId: "HViewProperties", title: "뷰의 속성" },
  "ViewStatus": { action: "ViewStatus", runtimeId: "HViewStatus", title: "뷰 상태 정보  ver:0x06000101HwpCtrl.GetViewStatus에서 사용, 해당 액션은 존재하지 않음." },
  "XMLOpenSave": { action: "XMLOpenSave", runtimeId: "HXMLOpenSave", title: "XMLOpenSave" },
  "XMLSchema": { action: "XMLSchema", runtimeId: "HXMLSchema", title: "XMLSchema" },
  "XSecurity": { action: "XSecurity", runtimeId: "HXSecurity", title: "XSecurity" },
} as const;
