// AUTO-GENERATED. DO NOT EDIT.
// Source: tools/gen-psets.cjs
// Inputs: src/spec/parametersets.json
export type ParamValue = string | number | boolean | null;
export type ParamMap = Record<string, ParamValue>;

export type ParameterSetId =
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

export type ParameterSetSpec = {
  setId: ParameterSetId;
  runtimeId: string;
  title: string;
  keys: readonly string[];
};

export const PARAMETER_SETS: Record<ParameterSetId, ParameterSetSpec> = {
  "ActionCrossRef": { setId: "ActionCrossRef", runtimeId: "HActionCrossRef", title: "상호참조 삽입", keys: ["Command"] },
  "AddHanjaWord": { setId: "AddHanjaWord", runtimeId: "HAddHanjaWord", title: "AddHanjaWord", keys: ["Hangul", "Hanja"] },
  "AppState": { setId: "AppState", runtimeId: "HAppState", title: "AppState", keys: ["AdjustPrevPictureSize", "CreationID", "CreationMode", "HandlerType", "KeyMacro", "Overwrite", "Presentation", "ScrMacro", "ZOrder"] },
  "AutoFill": { setId: "AutoFill", runtimeId: "HAutoFill", title: "자동 채우기", keys: ["AutoFillItem", "AutoFillSection"] },
  "AutoNum": { setId: "AutoNum", runtimeId: "HAutoNum", title: "번호 넣기", keys: ["NewNumber", "NumFormat", "NumType"] },
  "Bibliography": { setId: "Bibliography", runtimeId: "HBibliography", title: "Bibliography", keys: ["BibGUID", "BibHasDocument", "BibIndex", "BibNameABBREVIATEDCASENUMBER", "BibNameACCESSDAY", "BibNameACCESSMONTH", "BibNameACCESSYEAR", "BibNameALBUMTITLE", "BibNameBOOKTITLE", "BibNameBROADCASTER", "BibNameBROADCASTTITLE", "BibNameCASENUMBER", "BibNameCHAPTERNUMBER", "BibNameCITY", "BibNameCOMMENTS", "BibNameCONFERENCENAME", "BibNameCOURT", "BibNameDAY", "BibNameDEPARTMENT", "BibNameDISTRIBUTOR", "BibNameDOI", "BibNameEDITION", "BibNameINSTITUTION", "BibNameINTERNETSITETITLE", "BibNameISSUE", "BibNameJOURNALNAME", "BibNameLangType", "BibNameMEDIUM", "BibNameMONTH", "BibNameNUMBERVOLUMES", "BibNamePAGE", "BibNamePAPER", "BibNamePATENTNUMBER", "BibNamePATENTTYPE", "BibNamePERIODICALTITLE", "BibNamePRODUCTION", "BibNamePUBLICATIONTITLE", "BibNamePUBLISHER", "BibNameRECORDINGNUMBER", "BibNameREGION", "BibNameREPORTER", "BibNames", "BibNameSHORTTITLE", "BibNameSTANDARDNUMBER", "BibNameSTATEPROVINCE", "BibNameSTATION", "BibNameTAG", "BibNameTHEATER", "BibNameTHESISTYPE", "BibNameTITLE", "BibNameURL", "BibNameVERSION", "BibNameVOLUME", "BibNameYEAR", "BibStyleIndex", "BibType", "BibUsedTagNAme"] },
  "BibliographyAll": { setId: "BibliographyAll", runtimeId: "HBibliographyAll", title: "BibliographyAll", keys: ["BibItemDocument", "BibItemEngine", "BibItemVolitale"] },
  "BibliographyName": { setId: "BibliographyName", runtimeId: "HBibliographyName", title: "BibliographyName", keys: ["BibNameCorperate", "BibNameFirst", "BibNameLast", "BibNameMiddle", "BibNameType"] },
  "BlogAccount": { setId: "BlogAccount", runtimeId: "HBlogAccount", title: "BlogAccount", keys: ["BlogAccountAuthorID", "BlogAccountBlogID", "BlogAccountFlag", "BlogAccountName", "BlogAccountPass", "BlogAccountServer", "BlogAccountType"] },
  "BlogUpload": { setId: "BlogUpload", runtimeId: "HBlogUpload", title: "BlogUpload", keys: ["BlogUploadAccount", "BlogUploadCategory", "BlogUploadPostContent", "BlogUploadPostID", "BlogUploadPostTitle", "BlogUploadPublish"] },
  "BookMark": { setId: "BookMark", runtimeId: "HBookMark", title: "책갈피", keys: ["Command", "name", "type"] },
  "BorderFill": { setId: "BorderFill", runtimeId: "HBorderFill", title: "테두리/배경의 일반 속성", keys: ["BackSlashFlag", "BorderColorBottom", "BorderColorRight", "BorderColorTop", "BorderCorlorLeft", "BorderFill3D", "BorderTypeBottom", "BorderTypeLeft", "BorderTypeRight", "BorderTypeTop", "BorderWidthBottom", "BorderWidthLeft", "BorderWidthRight", "BorderWidthTop", "BreakCellSeparateLine", "CenterLineFlag", "CounterBackSlashFlag", "CounterSlashFlag", "CrookedSlashFlag", "CrookedSlashFlag1", "CrookedSlashFlag2", "DiagonalColor", "DiagonalType", "DiagonalWidth", "FillAttr", "ShadeFaceColorIncDec", "Shadow", "SlashFlag"] },
  "BorderFillExt": { setId: "BorderFillExt", runtimeId: "HBorderFillExt", title: "UI 구현을 위한 BorderFill 확장BorderFillExt는 BorderFill로부터 계승받았으므로 위 표에 정리된 BorderFillExt의 아이템들 이외에 BorderFill의 아이템들을 사용할 수 있다.", keys: ["ColorHorz", "ColorVert", "TypeHorz", "TypeVert", "WidthHorz", "WidthVert"] },
  "BrailleConvert": { setId: "BrailleConvert", runtimeId: "HBrailleConvert", title: "점자 변환", keys: ["CharHeight", "CharSpacing", "FontName", "FontType", "LineCharApply", "LineCharType", "LineSpacing", "PaperApply", "PaperType", "ResultType", "TargetView"] },
  "BulletShape": { setId: "BulletShape", runtimeId: "HBulletShape", title: "불릿 모양(글머리표 모양)", keys: ["Alignment", "AutoIndent", "BulletChar", "BulletImage", "CharShape", "Checkable", "CheckedBulletChar", "HasCharShape", "HasImage", "TextOffset", "TextOffsetType", "UseInstWidth", "WidthAdjust"] },
  "CCLMark": { setId: "CCLMark", runtimeId: "HCCLMark", title: "CCLMark", keys: ["ImageSize", "LicenseCountry", "PermitCommercial", "PermitModify", "ShowImageText"] },
  "Caption": { setId: "Caption", runtimeId: "HCaption", title: "캡션 속성", keys: ["CapFullSize", "Gap", "Side", "Width"] },
  "CaptureEnd": { setId: "CaptureEnd", runtimeId: "HCaptureEnd", title: "갈무리 끝갈무리 때 코어엔진에서 액션에게 보내는 정보(시작/끝점의 좌표). 내부에서만 사용된다.", keys: ["BeginX", "BeginY", "EndX", "EndY", "PageNum"] },
  "Cell": { setId: "Cell", runtimeId: "HCell", title: "셀Cell은 ListProperties로부터 계승받았으므로 위 표에 정리된 Cell의 아이템들 이외에 ListProperties의 아이템들을 사용할 수 있다.", keys: ["CellCtrlData", "Dirty", "Editable", "HasMargin", "Header", "Height", "LineWrap", "MarginBottom", "MarginLeft", "MarginRight", "MarginTop", "Protected", "TextDirection", "VertAlign", "Width"] },
  "CellBorderFill": { setId: "CellBorderFill", runtimeId: "HCellBorderFill", title: "셀 테두리/배경CellBorderFill은 BorderFillExt로부터 계승받았으므로 위 표에 정리된 CellBorderFill의 아이템들 이외에 BorderFillExt의 아이템들을 사용할 수 있다.", keys: ["AllCellsBorderFill", "ApplyBorderToEdge", "ApplyTo", "BackSlashFlag", "BorderColorBottom", "BorderColorRight", "BorderColorTop", "BorderCorlorLeft", "BorderFill3D", "BorderTypeBottom", "BorderTypeLeft", "BorderTypeRight", "BorderTypeTop", "BorderWidthBottom", "BorderWidthLeft", "BorderWidthRight", "BorderWidthTop", "BreakCellSeparateLine", "CenterLineFlag", "ColorHorz", "ColorVert", "CounterBackSlashFlag", "CounterSlashFlag", "CrookedSlashFlag", "CrookedSlashFlag1", "CrookedSlashFlag2", "DiagonalColor", "DiagonalType", "DiagonalWidth", "FillAttr", "NoNeighborCell", "SelCellsBorderFill", "ShadeFaceColorIncDec", "Shadow", "SlashFlag", "TableBorderFill", "TypeHorz", "TypeVert", "WidthHorz", "WidthVert"] },
  "CertDRM": { setId: "CertDRM", runtimeId: "HCertDRM", title: "CertDRM", keys: ["EndDate", "LimitCopy", "LimitPrint", "ReceiverPrivInfos", "ReceiverPublicKeys", "SenderCertEndDate", "SenderCertIssuer", "SenderCertUsage", "SenderPrivateInfo", "SenderPrivateKey", "SenderPublicKey", "SetDate", "StartDate"] },
  "ChCompose": { setId: "ChCompose", runtimeId: "HChCompose", title: "글자 겹침", keys: ["Chars", "CharShapes", "CharSize", "CheckCompose", "CircleType"] },
  "ChComposeShapes": { setId: "ChComposeShapes", runtimeId: "HChComposeShapes", title: "글자 겹치기 글자 속성셋", keys: ["CircleCharShape", "InnerCharShape1", "InnerCharShape2", "InnerCharShape3", "InnerCharShape4", "InnerCharShape5", "InnerCharShape6", "InnerCharShape7", "InnerCharShape8", "InnerCharShape9"] },
  "ChangeRome": { setId: "ChangeRome", runtimeId: "HChangeRome", title: "로마자 변환", keys: ["HanString", "option", "RomeString"] },
  "ChangeRomeUser": { setId: "ChangeRomeUser", runtimeId: "HChangeRomeUser", title: "ChangeRomeUser", keys: [] },
  "CharShape": { setId: "CharShape", runtimeId: "HCharShape", title: "글자 모양", keys: ["Bold", "BorderFill", "DiacSymMark", "Emboss", "Engrave", "FaceNameHangul", "FaceNameHanja", "FaceNameJapanese", "FaceNameLatin", "FaceNameOther", "FaceNameSymbol", "FaceNameUser", "FontTypeHangul", "FontTypeHanja", "FontTypeJapanese", "FontTypeLatin", "FontTypeOther", "FontTypeSymbol", "FontTypeUser", "Height", "Italic", "OffsetHangul", "OffsetHanja", "OffsetJapanese", "OffsetLatin", "OffsetOther", "OffsetSymbol", "OffsetUser", "OutLineType", "RatioHangul", "RatioHanja", "RatioJapanese", "RatioLatin", "RatioOther", "RatioSymbol", "RatioUser", "ShadeColor", "ShadowColor", "ShadowOffsetX", "ShadowOffsetY", "ShadowType", "SizeHangul", "SizeHanja", "SizeJapanese", "SizeLatin", "SizeOther", "SizeSymbol", "SizeUser", "SmallCaps", "SpacingHangul", "SpacingHanja", "SpacingJapanese", "SpacingLatin", "SpacingOther", "SpacingSymbol", "SpacingUser", "StrikeOutColor", "StrikeOutShape", "StrikeOutType", "SubScript", "SuperScript", "TextColor", "UnderlineColor", "UnderlineShape", "UnderlineType", "UseFontSpace", "UseKerning"] },
  "ChartObjShape": { setId: "ChartObjShape", runtimeId: "HChartObjShape", title: "ChartObjShape", keys: ["ChartGroup", "ChartIndex"] },
  "CodeTable": { setId: "CodeTable", runtimeId: "HCodeTable", title: "문자표", keys: ["Text"] },
  "ColDef": { setId: "ColDef", runtimeId: "HColDef", title: "단 정의 속성", keys: ["Count", "Layout", "LineColor", "LineType", "LineWidth", "SameGap", "SameSize", "type", "WidthGap"] },
  "CommPermission": { setId: "CommPermission", runtimeId: "HCommPermission", title: "CommPermission", keys: ["PermissionURI"] },
  "CompatibleDocument": { setId: "CompatibleDocument", runtimeId: "HCompatibleDocument", title: "호환 문서", keys: ["CurrentVersion", "Default", "TargetProgram"] },
  "ConvertCase": { setId: "ConvertCase", runtimeId: "HConvertCase", title: "대/소문자 변환", keys: ["type"] },
  "ConvertFullHalf": { setId: "ConvertFullHalf", runtimeId: "HConvertFullHalf", title: "전/반각 변환", keys: ["Alpha", "Gata", "HGJamo", "Number", "Symbol", "type"] },
  "ConvertHiraToGata": { setId: "ConvertHiraToGata", runtimeId: "HConvertHiraToGata", title: "히라가나/가타가나 변환", keys: ["type"] },
  "ConvertJianFan": { setId: "ConvertJianFan", runtimeId: "HConvertJianFan", title: "간/번체 변환", keys: ["type"] },
  "ConvertToHangul": { setId: "ConvertToHangul", runtimeId: "HConvertToHangul", title: "한자, 일어, 구결을 한글로", keys: ["Gata", "Gu", "Hanja", "HanjaHangul", "Hira", "type"] },
  "CtrlData": { setId: "CtrlData", runtimeId: "HCtrlData", title: "컨트롤 데이터컨트롤 데이터. 컨트롤에 임의로 설정할 수 있는 데이터 셋. 기본적으로 서브셋을 사용하는 것을 원칙으로 한다.", keys: ["name"] },
  "DeleteCtrls": { setId: "DeleteCtrls", runtimeId: "HDeleteCtrls", title: "조판 부호 컨트롤 지우기", keys: ["DeleteCtrlType"] },
  "DeletePage": { setId: "DeletePage", runtimeId: "HDeletePage", title: "쪽 지우기  글2007", keys: ["Range", "RangeCustom", "UsingPagenum"] },
  "DocDRM": { setId: "DocDRM", runtimeId: "HDocDRM", title: "DocDRM", keys: ["AskCert", "Cert", "DecryptKey", "Flag", "RecieverCert"] },
  "DocData": { setId: "DocData", runtimeId: "HDocData", title: "DocData", keys: ["type"] },
  "DocFilters": { setId: "DocFilters", runtimeId: "HDocFilters", title: "Document 필터 리스트", keys: ["DocFilters", "Format", "Hide", "type"] },
  "DocFindInfo": { setId: "DocFindInfo", runtimeId: "HDocFindInfo", title: "문서 찾기", keys: ["ListID", "ParaID", "Pos"] },
  "DocumentFilterDialog": { setId: "DocumentFilterDialog", runtimeId: "HDocumentFilterDialog", title: "DocumentFilterDialog", keys: ["DbfCodeType", "DbfDelSpace", "DbfReadType", "DbfRecordEnd", "DbfRecordNumbering", "DbfRecordStart", "DocImgSaveType", "FlashBackgroundColor", "FlashNextButton", "FlashNonselectImagePath", "FlashPageEnd", "FlashPageStart", "FlashSelectImagePath", "HtmlCodeType", "HtmlDefault", "HtmlFilePath", "HtmlSend", "TextCodeType", "TextDefault", "TextFilePath", "TextFontName", "TextKeepAlign", "TextReadType", "UnicodeCodeType", "UnicodeFilePath", "UnicodeKeepAlign"] },
  "DocumentInfo": { setId: "DocumentInfo", runtimeId: "HDocumentInfo", title: "문서에 대한 정보", keys: ["CurCtrl", "CurPara", "CurParaCount", "CurParaLen", "CurPos", "DetailCharCount", "DetailCurPage", "DetailCurPrtPage", "DetailInfo", "DetailLineCount", "DetailPageCount", "DetailWordCount", "RootPara", "RootParaCount", "RootPos", "SecDef", "SectionInfo"] },
  "DrawArcType": { setId: "DrawArcType", runtimeId: "HDrawArcType", title: "그리기 개체의 부채꼴 테두리 모양", keys: ["Interval", "type"] },
  "DrawConnectLine": { setId: "DrawConnectLine", runtimeId: "HDrawConnectLine", title: "DrawConnectLine", keys: ["type"] },
  "DrawCoordInfo": { setId: "DrawCoordInfo", runtimeId: "HDrawCoordInfo", title: "그리기 개체의 좌표 정보정보를 얻을 때만 사용하도록 한다.", keys: ["Count", "Line", "Point"] },
  "DrawCtrlHyperlink": { setId: "DrawCtrlHyperlink", runtimeId: "HDrawCtrlHyperlink", title: "그리기 개체의 Hyperlink 정보", keys: ["Command", "CommandOops"] },
  "DrawEditDetail": { setId: "DrawEditDetail", runtimeId: "HDrawEditDetail", title: "그리기 개체의 다각형 편집", keys: ["Command", "index", "PointX", "PointY"] },
  "DrawFillAttr": { setId: "DrawFillAttr", runtimeId: "HDrawFillAttr", title: "그리기 개체의 채우기 속성", keys: ["Brightness", "Contrast", "DrawFillImageType", "Embedded", "filename", "FileNameStr", "GradationAlpha", "GradationAngle", "GradationBrush", "GradationCenterX", "GradationCenterY", "GradationColor", "GradationColorNum", "GradationIndexPos", "GradationStep", "GradationStepCenter", "GradationType", "ImageAlpha", "ImageBrush", "ImageCreateOnDrag", "InsideMarginBottom", "InsideMarginLeft", "InsideMarginRight", "InsideMarginTop", "OriginalSizeX", "OriginalSizeY", "PicEffectTo", "Reverse", "SkipBottom", "SkipLeft", "SkipRight", "SkipTop", "ToolbarColor", "type", "WinBrushAlpha", "WinBrushFaceColor", "WinBrushFaceStyle", "WinBrushHatchColor", "WindowsBrush"] },
  "DrawImageAttr": { setId: "DrawImageAttr", runtimeId: "HDrawImageAttr", title: "그림 개체 속성그림 개체의 속성을 지정하기 위한 파라메터셋.DrawFillAttr에서 그림과 관련된 속성만 빼서 파라메터셋으로 지정되었다.현재 DrawFillAttr와 상속관계가 지정되지 않았다. (차후 상속관계로 묶일 예정)", keys: ["Brightness", "Contrast", "DrawFillImageType", "Embedded", "FileInfo", "filename", "FileNameStr", "GradationBrush", "ImageAdjustPrevObject", "ImageAdjustTableCell", "ImageAlphaEffect", "ImageAutoRotate", "ImageBrush", "ImageCreateOnDrag", "ImageCreateTreatAsChar", "ImageInsertFileNameInCaption", "InsideMarginBottom", "InsideMarginLeft", "InsideMarginRight", "InsideMarginTop", "OriginalSizeX", "OriginalSizeY", "PicEffectTo", "Reverse", "SkipBottom", "SkipLeft", "SkipRight", "SkipTop", "WindowsBrush"] },
  "DrawImageScissoring": { setId: "DrawImageScissoring", runtimeId: "HDrawImageScissoring", title: "그림 개체의 자르기 정보", keys: ["HandleIndex", "Xoffset", "Yoffset"] },
  "DrawLayOut": { setId: "DrawLayOut", runtimeId: "HDrawLayOut", title: "그리기 개체의 Layout", keys: ["CreateNumPt", "CreatePt", "CurveSegmentInfo"] },
  "DrawLineAttr": { setId: "DrawLineAttr", runtimeId: "HDrawLineAttr", title: "그리기 개체의 선 속성", keys: ["Alpha", "Color", "EndCap", "HeadFill", "HeadSize", "HeadStyle", "OutLineStyle", "Style", "TailFill", "TailSize", "TailStyle", "Width"] },
  "DrawObjTemplateSave": { setId: "DrawObjTemplateSave", runtimeId: "HDrawObjTemplateSave", title: "DrawObjTemplateSave", keys: ["DrawTemplateCategory", "DrawTemplateType", "DrawTemplateTypeItem"] },
  "DrawRectType": { setId: "DrawRectType", runtimeId: "HDrawRectType", title: "사각형 모서리 모양", keys: ["type"] },
  "DrawResize": { setId: "DrawResize", runtimeId: "HDrawResize", title: "그리기 개체 Resizing 정보", keys: ["HandleIndex", "Mode", "Xoffset", "Yoffset"] },
  "DrawRotate": { setId: "DrawRotate", runtimeId: "HDrawRotate", title: "그리기 개체 회전 정보", keys: ["Angle", "CenterX", "CenterY", "Command", "ObjectCenterX", "ObjectCenterY", "RotateImage"] },
  "DrawScAction": { setId: "DrawScAction", runtimeId: "HDrawScAction", title: "그리기 개체 90도 회전 및 좌우/상하 뒤집기", keys: ["HorzFlip", "RotateAngel", "RotateCenterX", "RotateCenterY", "VertFlip"] },
  "DrawShadow": { setId: "DrawShadow", runtimeId: "HDrawShadow", title: "그리기 개체 그림자 정보", keys: ["ShadowAlpha", "ShadowColor", "ShadowOffsetX", "ShadowOffsetY", "ShadowType"] },
  "DrawShear": { setId: "DrawShear", runtimeId: "HDrawShear", title: "그리기 개체 기울이기 정보", keys: ["XFactor", "YFactor"] },
  "DrawSoEquationOption": { setId: "DrawSoEquationOption", runtimeId: "HDrawSoEquationOption", title: "DrawSoEquationOption", keys: ["AutoConvert", "ScriptDefault"] },
  "DrawSoMouseOption": { setId: "DrawSoMouseOption", runtimeId: "HDrawSoMouseOption", title: "DrawSoMouseOption", keys: ["CreateOnDrag", "CreateOnDragShowTooltip", "EasySelect"] },
  "DrawTextBox": { setId: "DrawTextBox", runtimeId: "HDrawTextBox", title: "DrawTextBox", keys: ["CtrlData", "Dirty", "Editable", "LineWrap", "MarginBottom", "MarginLeft", "MarginRight", "MarginTop", "TextDirection", "VertAlign"] },
  "DrawTextart": { setId: "DrawTextart", runtimeId: "HDrawTextart", title: "글맵시 속성", keys: ["AlignType", "CharSpacing", "FontName", "FontStyle", "FontType", "LineSpacing", "NumberOfLines", "ShadowColor", "ShadowOffsetX", "ShadowOffsetY", "ShadowType", "Shape", "string"] },
  "DrawVideoAttr": { setId: "DrawVideoAttr", runtimeId: "HDrawVideoAttr", title: "DrawVideoAttr", keys: ["VideoEmbedded", "VideoFrameImage", "VideoPath", "VideoTag", "VideoType"] },
  "DropCap": { setId: "DropCap", runtimeId: "HDropCap", title: "문단 첫 글자 장식", keys: ["FaceColor", "FaceName", "LineColor", "LineStyle", "LineWeight", "Spacing", "Style"] },
  "Dutmal": { setId: "Dutmal", runtimeId: "HDutmal", title: "덧말", keys: ["Align", "Delete", "FsizeRatio", "Modify", "option", "PosType", "ResultText", "StyleNo", "SubText"] },
  "EngineProperties": { setId: "EngineProperties", runtimeId: "HEngineProperties", title: "환경 설정 옵션HwpCtrl의 EngineProperties에서 사용된다. 해당 액션은 존재하지 않음", keys: ["CtrlMaskAs2002", "DoAnyCursorEdit", "DoOutlineStyle", "EnableAutoSpell", "FaxDriver", "ImageAutoCheck", "InsertLock", "OpenNewWindow", "OptimizeWebHwpCopy", "PDFDriver", "ShowGuildLines", "TabMoveCell"] },
  "EqEdit": { setId: "EqEdit", runtimeId: "HEqEdit", title: "수식EqEdit는 ShapeObject로부터 계승받았으므로 위 표에 정리된 EqEdit의 아이템들 이외에 ShapeObject의 아이템들을 사용할 수 있다.", keys: ["AdjustPrevObjAttr", "AdjustSelection", "AdjustTextbox", "AffectsLine", "AllowOverlap", "ApplyTo", "BaseUnit", "Color", "EqFontName", "FlowWithText", "Height", "HeightRelTo", "HoldAnchorObj", "HorzAlign", "HorzOffset", "HorzRelTo", "LayoutHeight", "LayoutWidth", "LineMode", "Lock", "NumberingType", "OutsideMarginBottom", "OutsideMarginLeft", "OutsideMarginRight", "OutsideMarginTop", "PageNumber", "ProtectSize", "string", "TextFlow", "TextWrap", "TreatAsChar", "Version", "VertAlign", "VertOffset", "VertRelTo", "VisualString", "Width", "WidthRelTo"] },
  "ExchangeFootnoteEndNote": { setId: "ExchangeFootnoteEndNote", runtimeId: "HExchangeFootnoteEndNote", title: "각주/미주 변환", keys: ["Flag"] },
  "FieldCtrl": { setId: "FieldCtrl", runtimeId: "HFieldCtrl", title: "필드 컨트롤의 공통 데이터", keys: ["Command", "CtrlData", "Editable", "FieldDirty", "User"] },
  "FileConvert": { setId: "FileConvert", runtimeId: "HFileConvert", title: "여러 파일을 동시에 특정 포맷으로 변환하여 저장 (관련 Action/API 존재하지 않음)", keys: ["DestFileList", "Format", "SrcFileList"] },
  "FileInfo": { setId: "FileInfo", runtimeId: "HFileInfo", title: "파일 정보HwpCtrl.GetFileInfo에서 사용, 해당 액션은 존재하지 않음.", keys: ["Compressed", "Encrypted", "Format", "VersionNum", "VersionStr"] },
  "FileOpen": { setId: "FileOpen", runtimeId: "HFileOpen", title: "파일 오픈", keys: ["Argument", "ModifiedFlag", "OpenFileName", "OpenFlag", "OpenFormat", "OpenReadOnly", "SaveCMFDoc30", "SaveDistribute", "SaveDRMDoc", "SaveFileName", "SaveFormat", "SaveHwp97", "SaveOverWrite"] },
  "FileOpenSave": { setId: "FileOpenSave", runtimeId: "HFileOpenSave", title: "FileOpenSave", keys: ["Argument", "Attributes", "filename", "Format", "Netffice", "OpenFlag", "OpenReadOnly"] },
  "FileSaveAs": { setId: "FileSaveAs", runtimeId: "HFileSaveAs", title: "파일 저장FileOpen과 멤버가 동일", keys: ["Argument", "ModifiedFlag", "OpenFileName", "OpenFlag", "OpenFormat", "OpenReadOnly", "SaveCMFDoc30", "SaveDistribute", "SaveDRMDoc", "SaveFileName", "SaveFormat", "SaveHwp97", "SaveOverWrite"] },
  "FileSaveBlock": { setId: "FileSaveBlock", runtimeId: "HFileSaveBlock", title: "블록 지정된 부분을 저장", keys: ["Argument", "filename", "Format"] },
  "FileSaveDaisy": { setId: "FileSaveDaisy", runtimeId: "HFileSaveDaisy", title: "FileSaveDaisy", keys: ["Author", "filename", "FolderName", "Title", "Uid"] },
  "FileSecurity": { setId: "FileSecurity", runtimeId: "HFileSecurity", title: "FileSecurity", keys: ["DocFlag", "DRMDLLVersion", "filename", "NoCopy", "NoPrint", "Notify", "PasswordAsk", "PasswordFullRange", "PasswordString"] },
  "FileSendMail": { setId: "FileSendMail", runtimeId: "HFileSendMail", title: "메일 보내기", keys: ["Filepath", "Subject", "To", "type"] },
  "FileSetSecurity": { setId: "FileSetSecurity", runtimeId: "HFileSetSecurity", title: "배포용 문서", keys: ["NoCopy", "NoPrint", "Password"] },
  "FileXMLSchema": { setId: "FileXMLSchema", runtimeId: "HFileXMLSchema", title: "FileXMLSchema", keys: ["NodeCreationOption", "XMLOpenSave"] },
  "FindImagePath": { setId: "FindImagePath", runtimeId: "HFindImagePath", title: "FindImagePath", keys: ["FindImagePathFile", "FindImagePathFolder", "FindImagePathNewFolder", "FindImagePathType"] },
  "FindReplace": { setId: "FindReplace", runtimeId: "HFindReplace", title: "찾기/찾아 바꾸기", keys: ["AllWordForms", "AutoSpell", "Direction", "FindCharShape", "FindJaso", "FindParaShape", "FindRegExp", "FindString", "FindStyle", "FindType", "HanjaFromHangul", "IgnoreFindString", "IgnoreMessage", "IgnoreReplaceString", "MatchCase", "ReplaceCharShape", "ReplaceMode", "ReplaceParaShape", "ReplaceString", "ReplaceStyle", "SeveralWords", "UseWildCards", "WholeWordOnly"] },
  "FlashProperties": { setId: "FlashProperties", runtimeId: "HFlashProperties", title: "플래시 파일 삽입 시 필요한 옵션", keys: ["AutoPlay", "Base", "BgColor", "LoopPlay", "Qulaity", "Scale", "ShowMenu", "WMode"] },
  "FootnoteShape": { setId: "FootnoteShape", runtimeId: "HFootnoteShape", title: "FootnoteShape", keys: ["BeneathText", "LineColor", "LineLength", "LineType", "LineWidth", "NewNumber", "NumberFormat", "PlaceAt", "PrefixChar", "Restart", "SpaceAboveLine", "SpaceBelowLine", "SpaceBetweenNotes", "Suffix", "SuperScript", "UserChar"] },
  "FormButtonAttr": { setId: "FormButtonAttr", runtimeId: "HFormButtonAttr", title: "FormButtonAttr", keys: ["BackStyle", "Caption", "RadioGroupName", "TriState", "Value"] },
  "FormCharshapeattr": { setId: "FormCharshapeattr", runtimeId: "HFormCharshapeattr", title: "FormCharshapeattr", keys: ["AutoSize", "CharShape", "FollowContext", "WordWarp"] },
  "FormComboboxAttr": { setId: "FormComboboxAttr", runtimeId: "HFormComboboxAttr", title: "FormComboboxAttr", keys: ["EditEnable", "ListBoxRows", "ListBoxWidth", "Text"] },
  "FormCommonAttr": { setId: "FormCommonAttr", runtimeId: "HFormCommonAttr", title: "FormCommonAttr", keys: ["BackColor", "BorderType", "Color", "Command", "DrawFrame", "Editable", "Enabled", "GroupName", "name", "Printable", "TabOrder", "TabStop"] },
  "FormEditAttr": { setId: "FormEditAttr", runtimeId: "HFormEditAttr", title: "FormEditAttr", keys: ["AlignText", "MaxLength", "MultiLine", "Number", "PasswordChar", "ReadOnly", "ScrollBars", "TabKeyBehavior", "Text"] },
  "FormGeneral": { setId: "FormGeneral", runtimeId: "HFormGeneral", title: "FormGeneral", keys: ["FormObjType"] },
  "FormListBoxAttr": { setId: "FormListBoxAttr", runtimeId: "HFormListBoxAttr", title: "FormListBoxAttr", keys: ["ItemHeight", "Text", "TopIndex"] },
  "FormObjHanjaBusu": { setId: "FormObjHanjaBusu", runtimeId: "HFormObjHanjaBusu", title: "FormObjHanjaBusu", keys: ["ResultString"] },
  "FormObjHanjaMean": { setId: "FormObjHanjaMean", runtimeId: "HFormObjHanjaMean", title: "FormObjHanjaMean", keys: ["ResultString"] },
  "FormObjInputCodeTable": { setId: "FormObjInputCodeTable", runtimeId: "HFormObjInputCodeTable", title: "FormObjInputCodeTable", keys: ["DefaultCode", "ResultString"] },
  "FormObjInputHanja": { setId: "FormObjInputHanja", runtimeId: "HFormObjInputHanja", title: "FormObjInputHanja", keys: ["InputString", "OneChar", "ResultLength", "ResultString"] },
  "FormObjInputIdiom": { setId: "FormObjInputIdiom", runtimeId: "HFormObjInputIdiom", title: "FormObjInputIdiom", keys: ["ResultLength", "ResultString", "SearchString"] },
  "FormScrollbarAttr": { setId: "FormScrollbarAttr", runtimeId: "HFormScrollbarAttr", title: "FormScrollbarAttr", keys: ["Delay", "LargeChange", "Max", "Min", "Page", "SmallChange", "type", "Value"] },
  "FtpUpload": { setId: "FtpUpload", runtimeId: "HFtpUpload", title: "웹서버로 올리기", keys: ["Directory", "filename", "Password", "Port", "SaveType", "Server", "SiteName", "UserName"] },
  "GetText": { setId: "GetText", runtimeId: "HGetText", title: "GetText", keys: ["Text"] },
  "GotoE": { setId: "GotoE", runtimeId: "HGotoE", title: "찾아가기", keys: ["SetSelectionIndex"] },
  "GridInfo": { setId: "GridInfo", runtimeId: "HGridInfo", title: "격자 정보", keys: ["Align", "HorzAlign", "HorzRange", "HorzSpan", "Method", "Show", "type", "VertAlign", "VertRange", "VertSpan", "ViewLine", "ZOrder"] },
  "HeaderFooter": { setId: "HeaderFooter", runtimeId: "HHeaderFooter", title: "머리말/꼬리말", keys: ["type"] },
  "HncMessageBox": { setId: "HncMessageBox", runtimeId: "HHncMessageBox", title: "HncMessageBox", keys: ["Caption", "Flag", "Result", "string"] },
  "HtmlPlusExport": { setId: "HtmlPlusExport", runtimeId: "HHtmlPlusExport", title: "HtmlPlusExport", keys: ["HtmlExportType"] },
  "HyperLink": { setId: "HyperLink", runtimeId: "HHyperLink", title: "하이퍼링크 삽입 / 고치기", keys: ["Command", "DirectInsert", "NoLInk", "ShapeObject", "Text"] },
  "HyperlinkJump": { setId: "HyperlinkJump", runtimeId: "HHyperlinkJump", title: "하이퍼링크 이동", keys: ["Source", "Target"] },
  "Idiom": { setId: "Idiom", runtimeId: "HIdiom", title: "상용구", keys: ["InputText", "InputType"] },
  "IndexMark": { setId: "IndexMark", runtimeId: "HIndexMark", title: "찾아보기 표식", keys: ["First", "Second"] },
  "InputDateStyle": { setId: "InputDateStyle", runtimeId: "HInputDateStyle", title: "날짜/시간 표시 형식", keys: ["DateStyleDataForm", "DateStyleType"] },
  "InputHanja": { setId: "InputHanja", runtimeId: "HInputHanja", title: "InputHanja", keys: ["Hangul", "Hanja", "HanjaToHangul", "OneChar", "option"] },
  "InputHanjaBusu": { setId: "InputHanjaBusu", runtimeId: "HInputHanjaBusu", title: "InputHanjaBusu", keys: ["BusuString"] },
  "InputHanjaMean": { setId: "InputHanjaMean", runtimeId: "HInputHanjaMean", title: "InputHanjaMean", keys: ["MeanString"] },
  "InsertFieldTemplate": { setId: "InsertFieldTemplate", runtimeId: "HInsertFieldTemplate", title: "상호 참조 넣기", keys: ["Editable", "ShowSingle", "TemplateDirection", "TemplateHelp", "TemplateName", "TemplateType"] },
  "InsertFile": { setId: "InsertFile", runtimeId: "HInsertFile", title: "파일 삽입", keys: ["FileArg", "FileFormat", "filename", "KeepCharshape", "KeepParashape", "KeepSection", "KeepStyle"] },
  "InsertText": { setId: "InsertText", runtimeId: "HInsertText", title: "텍스트 삽입", keys: ["Text"] },
  "Internet": { setId: "Internet", runtimeId: "HInternet", title: "Internet", keys: ["OpenUrlString", "OpenUrlWhere"] },
  "KeyMacro": { setId: "KeyMacro", runtimeId: "HKeyMacro", title: "키매크로", keys: ["index", "name", "RepeatCount"] },
  "Label": { setId: "Label", runtimeId: "HLabel", title: "라벨", keys: ["BoxLength", "BoxMarginHor", "BoxMarginVer", "BoxWidth", "LabelCols", "LabelRows", "Landscape", "LeftMargin", "PageCnt", "PageLen", "PageWidth", "TextGap", "TopMargin"] },
  "LinkDocument": { setId: "LinkDocument", runtimeId: "HLinkDocument", title: "문서 연결", keys: ["FootnoteInherit", "name", "PageInherit"] },
  "ListParaPos": { setId: "ListParaPos", runtimeId: "HListParaPos", title: "커서의 위치HwpCtrl.GetPosBySet. SetPosBySet, HwpCtrlCode.GetAnchorPos에서 사용, 해당 액션은 존재하지 않음.", keys: ["List", "Para", "Pos"] },
  "ListProperties": { setId: "ListProperties", runtimeId: "HListProperties", title: "서브 리스트의 속성", keys: ["LineWrap", "MarginBottom", "MarginLeft", "MarginRight", "MarginTop", "TextDirection", "VertAlign"] },
  "LoadUserInfoFile": { setId: "LoadUserInfoFile", runtimeId: "HLoadUserInfoFile", title: "LoadUserInfoFile", keys: ["DeleteCurUserInfo", "ExistMacroIdiomPath", "ExistTemplDocPath", "LoadBaseTemplDoc", "MacroIdiomPath", "MergeCurUserInfo", "SaveCurUserInfo", "TemplDocPath", "UserInfoDataFilePath"] },
  "LunarToSolar": { setId: "LunarToSolar", runtimeId: "HLunarToSolar", title: "LunarToSolar", keys: ["Day", "Month", "Year"] },
  "MailMergeGenerate": { setId: "MailMergeGenerate", runtimeId: "HMailMergeGenerate", title: "메일 머지 만들기", keys: ["Continue", "DbfCode", "DbfPath", "Field", "FieldUpdate", "filename", "HwpId", "HwpPath", "Input", "NxlPath", "Output", "PrintSet", "Subject", "type"] },
  "MakeContents": { setId: "MakeContents", runtimeId: "HMakeContents", title: "차례 만들기", keys: ["AutoTabRight", "Hyperlink", "Leader", "Level", "Make", "OutFileName", "Position", "StyleName", "Styles", "type"] },
  "MarkpenShape": { setId: "MarkpenShape", runtimeId: "HMarkpenShape", title: "형광펜 모양", keys: ["Color"] },
  "MasterPage": { setId: "MasterPage", runtimeId: "HMasterPage", title: "바탕쪽", keys: ["ApplyTo", "CopyMasterPageTypes", "CopySectionNumber", "Duplicate", "Front", "MasterPageTypes", "type"] },
  "MemoShape": { setId: "MemoShape", runtimeId: "HMemoShape", title: "메모 모양", keys: ["ActiveFillColor", "FillColor", "LineColor", "LineType", "LineWidth", "MemoType", "Width"] },
  "MessageSet": { setId: "MessageSet", runtimeId: "HMessageSet", title: "MessageSet", keys: ["string"] },
  "MetaData": { setId: "MetaData", runtimeId: "HMetaData", title: "MetaData", keys: ["MetaContent", "MetaDatatype", "MetaProperty", "MetaResource"] },
  "MetaTag": { setId: "MetaTag", runtimeId: "HMetaTag", title: "MetaTag", keys: ["MetaTagName"] },
  "MousePos": { setId: "MousePos", runtimeId: "HMousePos", title: "마우스 위치HwpCtrl.GetMousePos에서 사용, 해당 액션은 존재하지 않음.", keys: ["Page", "X", "XRelTo", "Y", "YRelTo"] },
  "MovieProperties": { setId: "MovieProperties", runtimeId: "HMovieProperties", title: "동영상 파일 삽입 시 필요한 옵션", keys: ["AutoPlay", "AutoRewind", "Base", "Caption", "EnablePos", "EnableTrack", "ShowAudio", "ShowChaption", "ShowCtrlPanel", "ShowMenu", "ShowPosCtrl", "ShowStatus", "ShowTrackBar"] },
  "NumberingShape": { setId: "NumberingShape", runtimeId: "HNumberingShape", title: "NumberingShape", keys: ["AlignmentLevel0", "AlignmentLevel1", "AlignmentLevel2", "AlignmentLevel3", "AlignmentLevel4", "AlignmentLevel5", "AlignmentLevel6", "AlignmentLevel7", "AlignmentLevel8", "AlignmentLevel9", "AutoIndentLevel0", "AutoIndentLevel1", "AutoIndentLevel2", "AutoIndentLevel3", "AutoIndentLevel4", "AutoIndentLevel5", "AutoIndentLevel6", "AutoIndentLevel7", "AutoIndentLevel8", "AutoIndentLevel9", "CharShapeLevel0", "CharShapeLevel1", "CharShapeLevel2", "CharShapeLevel3", "CharShapeLevel4", "CharShapeLevel5", "CharShapeLevel6", "CharShapeLevel7", "CharShapeLevel8", "CharShapeLevel9", "HasCharShapeLevel0", "HasCharShapeLevel1", "HasCharShapeLevel2", "HasCharShapeLevel3", "HasCharShapeLevel4", "HasCharShapeLevel5", "HasCharShapeLevel6", "HasCharShapeLevel7", "HasCharShapeLevel8", "HasCharShapeLevel9", "NewList", "NumFormatLevel0", "NumFormatLevel1", "NumFormatLevel2", "NumFormatLevel3", "NumFormatLevel4", "NumFormatLevel5", "NumFormatLevel6", "NumFormatLevel7", "NumFormatLevel8", "NumFormatLevel9", "StartNumber", "StartNumber0", "StartNumber1", "StartNumber2", "StartNumber3", "StartNumber4", "StartNumber5", "StartNumber6", "StartNumber7", "StartNumber8", "StartNumber9", "StrFormatLevel0", "StrFormatLevel1", "StrFormatLevel2", "StrFormatLevel3", "StrFormatLevel4", "StrFormatLevel5", "StrFormatLevel6", "StrFormatLevel7", "StrFormatLevel8", "StrFormatLevel9", "TextOffsetLevel0", "TextOffsetLevel1", "TextOffsetLevel2", "TextOffsetLevel3", "TextOffsetLevel4", "TextOffsetLevel5", "TextOffsetLevel6", "TextOffsetLevel7", "TextOffsetLevel8", "TextOffsetLevel9", "TextOffsetTypeLevel0", "TextOffsetTypeLevel1", "TextOffsetTypeLevel2", "TextOffsetTypeLevel3", "TextOffsetTypeLevel4", "TextOffsetTypeLevel5", "TextOffsetTypeLevel6", "TextOffsetTypeLevel7", "TextOffsetTypeLevel8", "TextOffsetTypeLevel9", "UseInstWidthLevel0", "UseInstWidthLevel1", "UseInstWidthLevel2", "UseInstWidthLevel3", "UseInstWidthLevel4", "UseInstWidthLevel5", "UseInstWidthLevel6", "UseInstWidthLevel7", "UseInstWidthLevel8", "UseInstWidthLevel9", "WidthAdjustLevel0", "WidthAdjustLevel1", "WidthAdjustLevel2", "WidthAdjustLevel3", "WidthAdjustLevel4", "WidthAdjustLevel5", "WidthAdjustLevel6", "WidthAdjustLevel7", "WidthAdjustLevel8", "WidthAdjustLevel9"] },
  "OleCreation": { setId: "OleCreation", runtimeId: "HOleCreation", title: "OLE 개체 생성", keys: ["Aspect", "Clsid", "FlashProperties", "IconMetafile", "IconMM", "IconXext", "IconYext", "InnerOCX", "MovieProperties", "Path", "SoProperties", "type"] },
  "PageBorderFill": { setId: "PageBorderFill", runtimeId: "HPageBorderFill", title: "구역의 쪽 테두리/배경PageBorderFill은 BorderFill로부터 계승받았으므로 위 표에 정리된 PageBorderFill의 아이템들 이외에 BorderFill의 아이템들을 사용할 수 있다.", keys: ["BackSlashFlag", "BorderColorBottom", "BorderColorRight", "BorderColorTop", "BorderCorlorLeft", "BorderFill3D", "BorderTypeBottom", "BorderTypeLeft", "BorderTypeRight", "BorderTypeTop", "BorderWidthBottom", "BorderWidthLeft", "BorderWidthRight", "BorderWidthTop", "BreakCellSeparateLine", "CenterLineFlag", "CounterBackSlashFlag", "CounterSlashFlag", "CrookedSlashFlag", "CrookedSlashFlag1", "CrookedSlashFlag2", "DiagonalColor", "DiagonalType", "DiagonalWidth", "FillArea", "FillAttr", "FooterInside", "HeaderInside", "OffsetBottom", "OffsetLeft", "OffsetRight", "OffsetTop", "ShadeFaceColorIncDec", "Shadow", "SlashFlag", "TextBorder"] },
  "PageDef": { setId: "PageDef", runtimeId: "HPageDef", title: "구역 내의 용지 설정 속성", keys: ["BottomMargin", "FooterLen", "GutterLen", "GutterType", "HeaderLen", "Landscape", "LeftMargin", "PaperHeight", "PaperWidth", "RightMargin", "TopMargin"] },
  "PageHiding": { setId: "PageHiding", runtimeId: "HPageHiding", title: "감추기", keys: ["Fields"] },
  "PageNumCtrl": { setId: "PageNumCtrl", runtimeId: "HPageNumCtrl", title: "페이지번호 (97의 홀수 쪽에서 시작)CtrlCode.Properties에서 사용된다.", keys: ["PageStartsOn"] },
  "PageNumPos": { setId: "PageNumPos", runtimeId: "HPageNumPos", title: "쪽 번호 위치", keys: ["DrawPos", "NewNumber", "NumberFormat", "PrefixChar", "SideChar", "SuffixChar", "UserChar"] },
  "ParaShape": { setId: "ParaShape", runtimeId: "HParaShape", title: "문단 모양", keys: ["AlignType", "AutoSpaceEAsianEng", "AutoSpaceEAsianNum", "BorderConnect", "BorderFill", "BorderOffsetBottom", "BorderOffsetLeft", "BorderOffsetRight", "BorderOffsetTop", "BorderText", "BreakLatinWord", "BreakNonLatinWord", "Bullet", "BulletID", "Checked", "Condense", "FontLineHeight", "HeadingType", "Indentation", "KeepLinesTogether", "KeepWithNext", "LeftMargin", "Level", "LineSpacing", "LineSpacingType", "LineWrap", "NextSpacing", "Numbering", "NumberingID", "PagebreakBefore", "PrevSpacing", "RightMargin", "SnapToGrid", "SuppressLineNum", "TabDef", "TailType", "TextAlignment", "WidowOrphan"] },
  "Password": { setId: "Password", runtimeId: "HPassword", title: "문서 암호", keys: ["Ask", "FullRange", "Level", "ReadOnly", "ReadString", "RWAsk", "string", "WriteString"] },
  "PasteHtml": { setId: "PasteHtml", runtimeId: "HPasteHtml", title: "PasteHtml", keys: ["Default", "Format"] },
  "PictureChange": { setId: "PictureChange", runtimeId: "HPictureChange", title: "그림 바꾸기", keys: ["PictureEmbed", "PicturePath"] },
  "PluginCreation": { setId: "PluginCreation", runtimeId: "HPluginCreation", title: "PluginCreation", keys: ["Clsid", "SoProperties"] },
  "Preference": { setId: "Preference", runtimeId: "HPreference", title: "환경 설정", keys: ["ApplyForbidden", "ApplyLinkAttr", "EndForbiddenStr", "HwpxFormatDefaults", "PasteObjectAsPicture", "ShowSinglePage", "StartForbiddenStr", "UsePageLayout"] },
  "Presentation": { setId: "Presentation", runtimeId: "HPresentation", title: "프레젠테이션", keys: ["Effect", "InvertText", "ShowMode", "ShowPage", "ShowTime", "Sound"] },
  "PresentationRange": { setId: "PresentationRange", runtimeId: "HPresentationRange", title: "문서 전체 프레젠테이션 설정", keys: ["ExistPresentation", "PresentationDefault"] },
  "Print": { setId: "Print", runtimeId: "HPrint", title: "인쇄", keys: ["BinderHole", "BinderHoleType", "Collate", "Device", "DocAuthor", "DocTitle", "DontCallEndPage", "EvenOddPageType", "filename", "Flags", "FromPreView", "GraphicEffect", "GraphicQuality", "IdcPrintWallPaper", "ImageResampling", "InitialView", "LastBlankPage", "NumCopy", "OverlapSize", "PageLayout", "PanelView", "Pause", "PrintAutoFootNote", "PrintAutoFootnoteCtext", "PrintAutoFootnoteLtext", "PrintAutoFootnoteRtext", "PrintAutoHeadNote", "PrintAutoHeadnoteCtext", "PrintAutoHeadnoteLtext", "PrintAutoHeadnoteRtext", "PrintBarcode", "PrintClickHere", "PrintColorSet", "PrintCropMark", "PrintDrawObj", "PrinterName", "PrinterPaperLength", "PrinterPaperSize", "PrinterPaperWidth", "PrintFormObj", "PrintImage", "PrintMarkPen", "PrintMemo", "PrintMemoContents", "PrintMethod", "PrintMultiFile", "PrintPronounce", "PrintRevision", "PrintToFile", "PrintWatermark", "PrintWithoutBlank", "PromptOnly", "Range", "RangeCustom", "resolution", "ReverseOrder", "SaveFormat", "ShapeObjRotateAngle", "ShapeObjShear", "UseHft2Ttf", "UserOrder", "UseThread", "UsingPagenum", "ZoomX", "ZoomY"] },
  "PrintToImage": { setId: "PrintToImage", runtimeId: "HPrintToImage", title: "그림으로 저장", keys: ["colordepth", "filename", "Format", "Range", "RangeCustom", "resolution"] },
  "PrintWatermark": { setId: "PrintWatermark", runtimeId: "HPrintWatermark", title: "워터마크 속성", keys: ["AlphaImage", "AlphaText", "Brightness", "Contrast", "DrawFillImageType", "filename", "FontColor", "FontName", "FontSize", "FontType", "PicEffect", "PosPage", "RotateAngle", "ShadowColor", "ShadowOffsetX", "ShadowOffsetY", "ShadowType", "string", "TextWrap", "WaterMarkEff", "WatermarkType"] },
  "PrivateInfoSecurity": { setId: "PrivateInfoSecurity", runtimeId: "HPrivateInfoSecurity", title: "개인 정보 보안", keys: ["Account", "Address", "Birthday", "ChangePassword", "Command", "Credit", "DelHyperlink", "Email", "Etc", "ForeignerNo", "InfoType", "IPAddress", "License", "MarkChar", "MarkCharType", "NoMessageBox", "Passport", "Password", "PasswordOnOff", "Pattern", "Resident", "Telephone", "UserDef"] },
  "PronounceInfo": { setId: "PronounceInfo", runtimeId: "HPronounceInfo", title: "한자/일어 발음 표시", keys: ["FontName", "Hanja", "Heterography", "Japanese", "Position", "Show", "TextColor", "TextSize"] },
  "QCorrect": { setId: "QCorrect", runtimeId: "HQCorrect", title: "빠른 교정", keys: ["HyperLinkRunKey", "LauncherKey"] },
  "RWPassword": { setId: "RWPassword", runtimeId: "HRWPassword", title: "RWPassword", keys: ["Ask", "FullRange", "ReadOnly", "ReadString", "WriteString"] },
  "RangeTagShape": { setId: "RangeTagShape", runtimeId: "HRangeTagShape", title: "RangeTagShape", keys: ["Color", "Shape"] },
  "RevisionDef": { setId: "RevisionDef", runtimeId: "HRevisionDef", title: "교정부호 데이터", keys: ["BeginPos", "Margin", "SignType", "SubText"] },
  "SaveAsImage": { setId: "SaveAsImage", runtimeId: "HSaveAsImage", title: "바이너리 그림을 다른 형태로 저장하는 옵션을 설정", keys: ["DelCutting", "MinHeight", "MinWidth", "ResizeImage", "SaveAsFormat", "SaveDpiX", "SaveDpiY", "SaveType"] },
  "SaveFootnote": { setId: "SaveFootnote", runtimeId: "HSaveFootnote", title: "주석 저장", keys: ["filename", "Flag"] },
  "SaveUserInfoFile": { setId: "SaveUserInfoFile", runtimeId: "HSaveUserInfoFile", title: "SaveUserInfoFile", keys: ["ExistMacroIdiomPath", "ExistTemplDocPath", "MacroIdiomPath", "SaveBaseTemplDoc", "TemplDocPath", "UserInfoDataFilePath"] },
  "ScriptMacro": { setId: "ScriptMacro", runtimeId: "HScriptMacro", title: "스크립트 매크로", keys: ["Detail", "index", "name", "RepeatCount"] },
  "ScrollPosInfo": { setId: "ScrollPosInfo", runtimeId: "HScrollPosInfo", title: "ScrollPosInfo", keys: ["HorzLimitPos", "HorzPos", "VertLimitPos", "VertPos"] },
  "SearchAddress": { setId: "SearchAddress", runtimeId: "HSearchAddress", title: "SearchAddress", keys: [] },
  "SearchForeign": { setId: "SearchForeign", runtimeId: "HSearchForeign", title: "SearchForeign", keys: [] },
  "SecDef": { setId: "SecDef", runtimeId: "HSecDef", title: "구역의 속성", keys: ["CharGrid", "EndnoteShape", "EquationNumber", "FigureNumber", "FirstBorder", "FirstFill", "FootnoteShape", "HideBorder", "HideEmptyLine", "HideFill", "HideFooter", "HideHeader", "HideMasterPage", "HidePageNumPos", "LineGrid", "LineNumberCountBy", "LineNumberDistance", "LineNumberRestart", "LineNumberStart", "MemoShape", "OutlineShape", "PageBorderFillBoth", "PageBorderFillEven", "PageBorderFillOdd", "PageDef", "PageNumber", "ShowLineNumbers", "SpaceBetweenColumns", "StartsOn", "TableNumber", "TabStop", "TextDirection", "TextVerticalWidthHead", "WongojiFormat"] },
  "SectionApply": { setId: "SectionApply", runtimeId: "HSectionApply", title: "적용할 구역 설정", keys: ["ApplyTo", "Category", "ConvAplly2Index", "index", "string"] },
  "SectionMasterPage": { setId: "SectionMasterPage", runtimeId: "HSectionMasterPage", title: "SectionMasterPage", keys: ["SectionMasterPageTypes", "SectionNumber"] },
  "SelectionOpt": { setId: "SelectionOpt", runtimeId: "HSelectionOpt", title: "SelectionOpt", keys: ["option"] },
  "ShapeCopyPaste": { setId: "ShapeCopyPaste", runtimeId: "HShapeCopyPaste", title: "모양 복사", keys: ["CellAttr", "CellBorder", "CellFill", "type", "TypeBodyAndCellOnly"] },
  "ShapeGuideLine": { setId: "ShapeGuideLine", runtimeId: "HShapeGuideLine", title: "ShapeGuideLine", keys: ["CoordInfo", "Line", "Magnet", "Method", "Show", "Tooltip", "TooltipSizeInfo"] },
  "ShapeObjComment": { setId: "ShapeObjComment", runtimeId: "HShapeObjComment", title: "개체 설명문개체 설명문", keys: ["EditShapeObjCommentFlag", "EditShapeObjCommentStr"] },
  "ShapeObjSaveAsPicture": { setId: "ShapeObjSaveAsPicture", runtimeId: "HShapeObjSaveAsPicture", title: "ShapeObjSaveAsPicture", keys: ["Ext", "Path"] },
  "ShapeObject": { setId: "ShapeObject", runtimeId: "HShapeObject", title: "그리기 개체의 공통 속성 (도형, 글상자, 표, 그림 등)ShapeObject는 글의 컨트롤 중 편집영역을 자연스럽게 이동할 수 있는 개체를 말한다. 일반적으로 이런 개체들은 선택했을 때", keys: ["AdjustPrevObjAttr", "AdjustSelection", "AdjustTextbox", "AffectsLine", "AllowOverlap", "ApplyTo", "BaseUnit", "BorderFill", "CellMarginBottom", "CellMarginLeft", "CellMarginRight", "CellMarginTop", "CellSpacing", "ChangedShapeID", "Color", "DrawSizeInfo", "EqFontName", "FlowWithText", "Height", "HeightRelTo", "HoldAnchorObj", "HorzAlign", "HorzOffset", "HorzRelTo", "LayoutHeight", "LayoutWidth", "LineMode", "Lock", "NumberingType", "OptLockProperties", "OptTargetList", "OutsideMarginBottom", "OutsideMarginLeft", "OutsideMarginRight", "OutsideMarginTop", "PageBreak", "PageNumber", "ProtectSize", "RepeatHeader", "ShapeCaption", "ShapeComment", "ShapeDrawArcType", "ShapeDrawCoordInfo", "ShapeDrawCtrlHyperlink", "ShapeDrawEditDetail", "ShapeDrawFillAttr", "ShapeDrawImageAttr", "ShapeDrawImageScissoring", "ShapeDrawLayOut", "ShapeDrawLineAttr", "ShapeDrawRectType", "ShapeDrawResize", "ShapeDrawRotate", "ShapeDrawScAction", "ShapeDrawShadow", "ShapeDrawShear", "ShapeDrawSoEquationOption", "ShapeDrawSoMouseOption", "ShapeDrawTextart", "ShapeDrawVideoAttr", "ShapeFormButtonAttr", "ShapeFormCharshapeattr", "ShapeFormComboboxAttr", "ShapeFormCommonAttr", "ShapeFormEditAttr", "ShapeFormGeneral", "ShapeFormListBoxAttr", "ShapeFormScrollbarAttr", "ShapeListProperites", "ShapeTableCell", "string", "TableBorderFill", "TableCharInfo", "TextFlow", "TextWrap", "TreatAsChar", "Version", "VertAlign", "VertOffset", "VertRelTo", "VisualString", "Width", "WidthRelTo"] },
  "ShapeObjectCopyPaste": { setId: "ShapeObjectCopyPaste", runtimeId: "HShapeObjectCopyPaste", title: "그리기 개체 모양 복사/붙여 넣기", keys: ["ShapeObjectFill", "ShapeObjectLine", "ShapeObjectPicEffect", "ShapeObjectShadow", "ShapeObjectSize", "type"] },
  "SolarToLunar": { setId: "SolarToLunar", runtimeId: "HSolarToLunar", title: "SolarToLunar", keys: ["Day", "Leap", "Month", "Year"] },
  "Sort": { setId: "Sort", runtimeId: "HSort", title: "소트", keys: ["CheckExtendYear", "CheckFromRear", "CheckJaso", "CheckJasoReverse", "DelimiterChars", "DelimiterType", "EachPara", "IgnoreMultiDelimiter", "KeyOption", "LangOrderType", "YearBase"] },
  "SpellingCheck": { setId: "SpellingCheck", runtimeId: "HSpellingCheck", title: "SpellingCheck", keys: ["CheckStart", "NotifyResult"] },
  "Style": { setId: "Style", runtimeId: "HStyle", title: "스타일", keys: ["Apply"] },
  "StyleDelete": { setId: "StyleDelete", runtimeId: "HStyleDelete", title: "스타일 지우기", keys: ["Alternation", "Target"] },
  "StyleItem": { setId: "StyleItem", runtimeId: "HStyleItem", title: "스타일 - 바로 편집하기 대화상자", keys: ["CharShape", "LockForm", "NameEng", "NameLocal", "Next", "ParaShape", "type"] },
  "StyleTemplate": { setId: "StyleTemplate", runtimeId: "HStyleTemplate", title: "스타일 마당", keys: ["filename", "NameEngs", "NameLocals"] },
  "Sum": { setId: "Sum", runtimeId: "HSum", title: "블록 계산 (합계/평균/줄 수)", keys: ["Average", "Comma", "LineCount", "Method", "option", "Sum"] },
  "SummaryInfo": { setId: "SummaryInfo", runtimeId: "HSummaryInfo", title: "문서 정보", keys: ["Author", "ChangeImageExtFrom", "ChangeImageExtTo", "Characters", "CharactersExceptSpace", "Comments", "CopyPapers", "CreationTimeHigh", "CreationTimeLow", "Date", "DocVersion", "EmbedImagePath", "Etcetera", "ExtractImageBaseFileName", "ExtractImageExtName", "ExtractImagePath", "HanjaChar", "HwpVersion", "Keywords", "LastSavedBy", "Lines", "MetaTag", "ModifiedTimeHigh", "ModifiedTimeLow", "Pages", "Paragraphs", "PrintedTimeHigh", "PrintedTimeLow", "SelectedSummaryInfo", "Subject", "Title", "Words"] },
  "TabDef": { setId: "TabDef", runtimeId: "HTabDef", title: "탭 정의", keys: ["AutoTabLeft", "AutoTabRight", "DeleteTab", "TabItem"] },
  "Table": { setId: "Table", runtimeId: "HTable", title: "표Table은 ShapeObject로부터 계승받았으므로 위 표에 정리된 Table의 아이템들 이외에 ShapeObject의 아이템들을 사용할 수 있다.", keys: ["AdjustPrevObjAttr", "AdjustSelection", "AdjustTextbox", "AffectsLine", "AllowOverlap", "BorderFill", "Cell", "CellMarginBottom", "CellMarginLeft", "CellMarginRight", "CellMarginTop", "CellSpacing", "FlowWithText", "Height", "HeightRelTo", "HoldAnchorObj", "HorzAlign", "HorzOffset", "HorzRelTo", "LayoutHeight", "LayoutWidth", "Lock", "NumberingType", "OutsideMarginBottom", "OutsideMarginLeft", "OutsideMarginRight", "OutsideMarginTop", "PageBreak", "PageNumber", "ProtectSize", "RepeatHeader", "TableBorderFill", "TableCharInfo", "TextFlow", "TextWrap", "TreatAsChar", "VertAlign", "VertOffset", "VertRelTo", "Width", "WidthRelTo"] },
  "TableBorderFill": { setId: "TableBorderFill", runtimeId: "HTableBorderFill", title: "TableBorderFill", keys: ["AllCellsBorderFill", "BorderApplyTo", "SelCellsBorderFill"] },
  "TableChartInfo": { setId: "TableChartInfo", runtimeId: "HTableChartInfo", title: "TableChartInfo", keys: ["CtrlID", "EndCol", "EndRow", "NextCtrlID", "StartCol", "StartRow"] },
  "TableCreation": { setId: "TableCreation", runtimeId: "HTableCreation", title: "표 생성", keys: ["CellInfo", "Cols", "ColWidth", "HeightType", "HeightValue", "RowHeight", "Rows", "TableDrawProperties", "TableProperties", "TableTemplate", "TableTemplateValue", "WidthType", "WidthValue"] },
  "TableDeleteLine": { setId: "TableDeleteLine", runtimeId: "HTableDeleteLine", title: "표의 줄/칸 삭제", keys: ["type"] },
  "TableDrawPen": { setId: "TableDrawPen", runtimeId: "HTableDrawPen", title: "마우스로 테이블을 그릴 때 쓰이는 펜", keys: ["Color", "Style", "Width"] },
  "TableInsertLine": { setId: "TableInsertLine", runtimeId: "HTableInsertLine", title: "표의 줄/칸 삽입", keys: ["Count", "Side"] },
  "TableSplitCell": { setId: "TableSplitCell", runtimeId: "HTableSplitCell", title: "셀 나누기", keys: ["Cols", "DistributeHeight", "Merge", "Mode2", "Rows"] },
  "TableStrToTbl": { setId: "TableStrToTbl", runtimeId: "HTableStrToTbl", title: "문자열을 표로", keys: ["AutoOrDefine", "DelimiterEtc", "DelimiterType", "KeepSeperator", "TableCreation", "UserDefine"] },
  "TableSwap": { setId: "TableSwap", runtimeId: "HTableSwap", title: "표 뒤집기", keys: ["SwapMargin", "type"] },
  "TableTblToStr": { setId: "TableTblToStr", runtimeId: "HTableTblToStr", title: "표를 문자열로", keys: ["DelimiterType", "UserDefine"] },
  "TableTemplate": { setId: "TableTemplate", runtimeId: "HTableTemplate", title: "표 마당 정보", keys: ["ApplyTarget", "CreateMode", "filename", "Format", "ThemeColor"] },
  "TextCtrl": { setId: "TextCtrl", runtimeId: "HTextCtrl", title: "TEXT 컨트롤의 공통 데이터CtrlCode.Properties에서 사용된다.", keys: ["CtrlData"] },
  "TextVertical": { setId: "TextVertical", runtimeId: "HTextVertical", title: "세로쓰기", keys: ["Landscape", "TextDirection", "TextVerticalWidthHead"] },
  "TrackChange": { setId: "TrackChange", runtimeId: "HTrackChange", title: "변경 추적", keys: ["ChangeColor", "ChangeShape", "DeleteColor", "DeleteShape", "Format", "FormatColor", "FormatShape", "InsertColor", "InsertShape", "MemoColor", "MemoLine", "MemoWidth", "Tooltip"] },
  "TransTranslate": { setId: "TransTranslate", runtimeId: "HTransTranslate", title: "TransTranslate", keys: ["TranslateApplyID", "TranslateApplyType", "TranslateRange", "TranslateResult", "TranslateSourceLang", "TranslateText", "TranslateTransLang"] },
  "UserQCommandFile": { setId: "UserQCommandFile", runtimeId: "HUserQCommandFile", title: "사용자 자동 명령 파일 저장/로드", keys: ["filename", "LoadType", "Save"] },
  "VersionInfo": { setId: "VersionInfo", runtimeId: "HVersionInfo", title: "버전 정보", keys: ["FileDiff", "ItemEndIndex", "ItemInfoDescription", "ItemInfoIndex", "ItemInfoLock", "ItemInfoTimeHi", "ItemInfoTimeLo", "ItemInfoWriter", "ItemOverWrite", "ItemSaveDescription", "ItemStartIndex", "ResultMergedPath", "ResultOption", "ResultShowMemo", "ResultSourcePath", "ResultTargetPath", "SaveFilePath", "SourcePath", "TargetPath", "TempFilePath", "UsedCert", "UsedStanTime", "VersionAutoSave", "VersionDiffSplitView"] },
  "VfsAuthentication": { setId: "VfsAuthentication", runtimeId: "HVfsAuthentication", title: "VfsAuthentication", keys: ["AuthenticationURL"] },
  "ViewProperties": { setId: "ViewProperties", runtimeId: "HViewProperties", title: "뷰의 속성", keys: ["DragDrop", "MouseWheelDir", "OptionFlag", "PageDir", "ZoomCntX", "ZoomCntY", "ZoomCustomDlg", "ZoomMirror", "ZoomRatio", "ZoomType"] },
  "ViewStatus": { setId: "ViewStatus", runtimeId: "HViewStatus", title: "뷰 상태 정보  ver:0x06000101HwpCtrl.GetViewStatus에서 사용, 해당 액션은 존재하지 않음.", keys: ["type", "ViewPosX", "ViewPosY"] },
  "XMLOpenSave": { setId: "XMLOpenSave", runtimeId: "HXMLOpenSave", title: "XMLOpenSave", keys: ["Argument", "OpenFlag", "XmlFileName", "XslFileName"] },
  "XMLSchema": { setId: "XMLSchema", runtimeId: "HXMLSchema", title: "XMLSchema", keys: ["HwpFileName", "SchemaFileName", "TemplateFileName", "TemplateName"] },
  "XSecurity": { setId: "XSecurity", runtimeId: "HXSecurity", title: "XSecurity", keys: ["CanonicalMethod", "CertificationInfo", "CertificationInfoAll", "DataPath", "EncryptionMethod", "HashMethod", "PrivateKey", "PrivInfo", "SignatureMethod", "SigValidate", "SigValidateDlg", "XsecSigTarget", "XsecTargetHwp"] },
} as const;

export function validateParamSet(setId: ParameterSetId, params: Record<string, any>): { ok: true; params: ParamMap } | { ok: false; error: string } {
  const spec = PARAMETER_SETS[setId];
  if (!spec) return { ok: false, error: `unknown setId: ${setId}` };
  const out: any = {};
  for (const k of Object.keys(params || {})) {
    if (!spec.keys.includes(k)) return { ok: false, error: `unknown param key for ${setId}: ${k}` };
    out[k] = params[k];
  }
  return { ok: true, params: out };
}
