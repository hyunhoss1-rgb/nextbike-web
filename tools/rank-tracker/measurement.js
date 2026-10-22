function isMeasured(item) {
  return item?.exposed === true || item?.exposed === false;
}

function summarizeItems(items, total) {
  const values = Object.values(items);
  const measuredCount = values.filter(isMeasured).length;
  const exposedCount = values.filter(item => item.exposed === true).length;
  return {
    totalKeywords: total,
    measuredCount,
    unknownCount: total - measuredCount,
    exposedCount,
    exposedRate: measuredCount ? ((exposedCount / measuredCount) * 100).toFixed(1) + '%' : null,
  };
}

function csvCell(value) { return '"' + String(value ?? '').replace(/"/g, '""') + '"'; }

function exportRow(kw, data) {
  const mobileUnknown = !isMeasured(data);
  return [data.category || '', kw,
    data.naverMobileRank ? `${data.naverMobileRank}번째` : mobileUnknown ? '미확인' : '가져온 결과에서 미확인',
    data.naverPcRank ? `${data.naverPcRank}번째` : data.naverPcStatus === 'not_found' ? '가져온 결과에서 미확인' : '미확인',
    data.googleRank ? `${data.googleRank}번째` : data.googleStatus === 'not_found' ? '가져온 결과에서 미확인' : '미확인',
    data.exposed === true ? '웹문서 발견' : mobileUnknown ? '조회 실패 또는 판독 필요' : '가져온 결과에서 미확인',
    data.link || '', data.measurementMethod || '기존 기록: 산정 기준 미확인', data.measuredAt || ''].map(csvCell);
}

module.exports = { isMeasured, summarizeItems, exportRow };
