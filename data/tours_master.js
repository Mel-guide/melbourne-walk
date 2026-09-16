function exportToursJSON() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. 시트 데이터 가져오기
  const pois = getSheetData(ss.getSheetByName("POIs"), "poi_id");
  const audios = getSheetData(ss.getSheetByName("Audios"), "audio_id");
  const toursRaw = getSheetRows(ss.getSheetByName("Tours"));
  const stopsRaw = getSheetRows(ss.getSheetByName("Tour_Stops"));

  // 2. 투어별 스톱 매핑
  const tourList = toursRaw.map(t => {
    const tourStops = stopsRaw
      .filter(s => s.tour_id === t.tour_id)
      .sort((a, b) => Number(a.sequence) - Number(b.sequence))
      .map(s => {
        const poi = pois[s.poi_id] || {};
        const audio = audios[s.audio_id] || {};
        return {
          sequence: Number(s.sequence),
          poi_id: s.poi_id,
          name_ko: poi.name_ko || "",
          name_en: poi.name_en || "",
          lat: Number(poi.lat),
          lng: Number(poi.lng),
          arrival_radius_m: Number(poi.arrival_radius_m || 30),
          visit_minutes: Number(poi.visit_minutes || 10),
          address: poi.address || "",
          audio_id: s.audio_id,
          title: audio.title || "",
          audio_url: audio.audio_url || "",
          script_intro: audio.script_intro || "",
          script_main: audio.script_main || "",
          script_trivia: audio.script_trivia || "",
          mandatory: s.mandatory === "TRUE" || s.mandatory === true
        };
      });

    return {
      tour_id: t.tour_id,
      title_ko: t.title_ko,
      title_en: t.title_en,
      estimated_min: Number(t.estimated_min),
      distance_km: Number(t.distance_km),
      target_audience: t.target_audience,
      stops: tourStops
    };
  });

  const output = JSON.stringify({ version: "1.0", generated_at: new Date(), tours: tourList }, null, 2);
  
  // 브라우저 팝업으로 JSON 텍스트 출력
  const html = HtmlService.createHtmlOutput(
    '<textarea style="width:100%;height:90%;">' + output + '</textarea>' +
    '<p>위 내용을 전체 복사하여 data/tours_master.json 파일에 저장하세요.</p>'
  ).setWidth(600).setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, "tours_master.json 내보내기 완료");
}

function getSheetRows(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function getSheetData(sheet, keyCol) {
  const rows = getSheetRows(sheet);
  let map = {};
  rows.forEach(r => map[r[keyCol]] = r);
  return map;
}function myFunction() {
  
}
