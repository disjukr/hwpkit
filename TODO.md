# TODO - HWP5 -> DocumentModel (native)

목표: HWP5에서 DocumentModel을 만들 때 **src/model/document/**에 정의된 필드들을 빠짐없이 채우기**.

제약/메모
- 현재 DocumentModel이 표현할 수 있는 컨트롤은 ControlType.Char 뿐임(표/그림/각주 등은 모델에 표현 불가). 이 TODO는 **모델에 정의된 필드와 인덱스를 정확히 채우는 것**에 집중한다.
- 구현하면서 테스트를 같이 추가/확장한다. 커밋은 작게 쪼갠다.

## 완료(최근)
- native-only reader: \readHwp5(buffer) -> DocumentModel
- PARA_TEXT 안의 \n을 문단 경계로 쪼개는 fallback
- BodyText 레코드에서 pageDef 파생(경험적 tag 73)
- mappingTable이 비지 않도록 기본값 보강(fonts/charShapes/paraShapes/styles)
- DocInfo styles(tag 26) 파싱해서 mappingTable.styles 채움(name/engName)
- DocInfo paraShapes(tag 25) 1차(휴리스틱) bitfield 파싱 파이프라인 구축
- DocInfo charShapes(tag 21) 색상 일부 파싱(\textColor, shadeColor, strikeColor)
- 기본 회귀 테스트 러너 추가: 
\npm test

## 1) ParaShape (DocInfo tag 25) – 파싱 완성
- [ ] PARA_SHAPE 스펙(필드 오프셋/비트)을 확정하고 아래 항목을 실제값으로 채우기
  - [x] \\tabDef 인덱스
  - [x] \\breakLatinWordType, \\breakNonLatinWord
  - [x] condense
  - [x] boolean들: widowOrphan, keepWithNext, keepLines, pageBreakBefore, \\fontLineHeight, snapToGrid
  - [x] lineWrapType, \\autoSpaceEAsianEng, \\autoSpaceEAsianNum
- [ ] 테스트
  - [x] 특정 샘플 기준으로 paraShapes[n] 값 assert 추가

## 2) CharShape (DocInfo tag 21) – 파싱 완성
- [ ] CHAR_SHAPE 스펙(필드 오프셋/비트)을 확정하고 아래 항목을 실제값으로 채우기
  - [x] \bold, italic
  - [x] underline (type/shape/color)
  - [x] strikeout (type/shape/color)
  - [x] outline (type)
  - [x] shadow (type/color/offsetX/offsetY)
  - [x] emboss, engrave, superscript, subscript
  - [x] useFontSpace, useKerning
  - [ ] \ratios/charSpacings/relSizes/charOffsets 의미/범위 검증
- [ ] 테스트
  - [x] 굵게/밑줄/그림자 등이 포함된 샘플 추가
  - [x] 파싱된 필드 값 assert 추가

## 3) Paragraph 인덱스 연결(BodyText)
- [ ] BodyText에서 문단 단위 메타데이터 파싱
  - [x] Paragraph.styleIndex
  - [x] Paragraph.paraShapeIndex
  - [x] Paragraph.instId
  - [x] pageBreak, columnBreak (empirical: PARA_HEADER flags)
- [ ] PARA_CHAR_SHAPE 파싱(문자 모양 포인터) 구현 → Paragraph.texts[]를 run 단위로 분할
  - [x] 올바른 Text.charShapeIndex로 구간(run) 생성
  - [x] controls와 텍스트 길이 정합성 유지 (U+FFFC placeholders filtered)
- [ ] 테스트
  - [x] 한 문단 내에서 charShape가 섞인 샘플(부분 굵게 등) 추가 → \texts.length > 1 확인
  - [x] charShapeIndex 변화 지점 assert

## 4) 단(Columns): Paragraph.colDef
- [x] 단 설정이 있는 문서에서 Paragraph.colDef 채우기 (empirical, BodyText tag69)
  - [x] \type, count, layoutType, sameSize, sameGap, columns[].width/gap (partial: count/sameGap filled)
- [x] 테스트
  - [x] 다단(2단/3단) 샘플 추가: samples/07, samples/08
  - [x] colDef populated assert

## 5) DocumentSetting 보강
- [ ] docSetting.caretPos 실제값 파싱(가능하면)
- [ ] docSetting.beginNumber 실제값 파싱(가능하면)
- [ ] 테스트
  - [ ] 해당 값이 기본값이 아닌 샘플이 있으면 추가

## 테스트 전략
- \test/run-tests.js는 스모크/회귀 테스트로 유지
- 기능 추가마다 타겟 assert를 늘리기
- samples/에 최소 샘플 문서 추가
  - [x] bold/italic/underline
  - [x] strikeout
  - [x] multi-column
  - [x] 한 문단 내 mixed char shapes


