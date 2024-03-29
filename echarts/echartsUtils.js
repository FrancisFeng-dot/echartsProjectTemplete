function initChart(eleId,boName,chartType,query){
	var chartObj = echarts.init(document.getElementById(eleId));
	var queryJson = {
		cfg_boName : boName
	};
	if(query && query instanceof Object){
		for(var key in query) {
			// 判断，如果query为%,%%,或者空的时候，去掉这个条件；
			if (query[key]!=='' && query[key]!=='%' && query[key]!=='%%'){
				queryJson['query_'+key]=query[key];
			}
		}
	}
	$.post(
		ctx + '/cmp/ajaxChart/loadData.do'	,
		queryJson,
		function(chartBean){
			var option;
			if(isNotNull(chartType)){
				if(chartType == 'line' || chartType == 'bar'){
					var legend = [];
					var series = [];
					var xAxisData;
					$.each(chartBean.data,function(i,item){
						legend[i] = item.name;
						series[i] = {name:item.name,type:chartType,data:item.data};
						xAxisData = item.xAxis;
					});
					option = {
						title : {
							text: chartBean.text,
							subtext: chartBean.subtext
						},
						tooltip : {
							trigger: 'axis'
						},
						legend: {
							data:legend
						},
						toolbox: {
							show : true,
							feature : {
								magicType : {show: true, type: ['line', 'bar']},
								restore : {show: true},
								saveAsImage : {show: true}
							}
						},
						calculable : true,
						xAxis : [
							{
								type : 'category',
								boundaryGap : chartType == 'bar' ? true : false,
								data : xAxisData
							}
						],
						yAxis : [
							{
								type : 'value'
							}
						],
						series : series
					};
				}else if(chartType == 'pie'){
					var legend = [];
					var series = [];
					var xAxisData;
					$.each(chartBean.data.data,function(i,item){
						legend[i] = item.name;
						series[i] = {name:item.name,value:item.value};
					});
					option = {
					    title : {
					        text: chartBean.text,
							subtext: chartBean.subtext,
					        x:'center'
					    },
					    tooltip : {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c} ({d}%)"
					    },
					    legend: {
					        orient : 'vertical',
					        x : 'left',
					        data:legend
					    },
					    toolbox: {
					        show : true,
					        feature : {
					            magicType : {
					                show: true, 
					                type: ['pie', 'funnel'],
					                option: {
					                    funnel: {
					                        x: '25%',
					                        width: '50%',
					                        funnelAlign: 'left',
					                        max: 1548
					                    }
					                }
					            },
					            restore : {show: true},
					            saveAsImage : {show: true}
					        }
					    },
					    calculable : true,
					    series : [
					        {
					            name:chartBean.data.name,
					            type:'pie',
					            radius : '55%',
					            center: ['50%', '60%'],
					            data:series
					        }
					    ]
					};
				}	
				chartObj.setOption(option);
			}
		},
		'json'
	);
	return chartObj;
}