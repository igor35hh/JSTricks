(function($) {

	function ajaxStart() {
		$('#progress').show();
	}

	function ajaxStop() {
		$('#progress').hide();
	}

	function downloadCSV(dataCVS, fileNameCSV) {  
        var data, filename, link;
        var csv = dataCVS;

        if (csv == null) return;

        filename = fileNameCSV || 'parce.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
            //csv = 'data:text/csv;charset=windows-1251,' + csv;
        }

        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

	function CsvGenerator(dataCVS, fileName) {
	    this.dataCVS = dataCVS;
	    this.fileName = fileName;
	    
	    this.getDownloadLink = function () {

	        var type = 'data:text/csv;charset=utf-8';
	        var data = this.dataCVS;

	        data = data + '\n';

	        if (typeof btoa === 'function') {
	            type += ';base64';
	            data = btoa(data);
	        } else {
	            data = encodeURIComponent(data);
	        }

	        return this.downloadLink = this.downloadLink || type + ',' + data;
	    };

	    this.getLinkElement = function (linkText) {
	        var downloadLink = this.getDownloadLink();
	        return this.linkElement = this.linkElement || $('<a>' + (linkText || '') + '</a>', {
	            href: downloadLink,
	            download: this.fileName
	        });
	    };

	    // call with removeAfterDownload = true if you want the link to be removed after downloading
	    this.download = function (removeAfterDownload) {
	        this.getLinkElement().css('display', 'none').appendTo('body');
	        this.getLinkElement()[0].click();
	        if (removeAfterDownload) {
	            this.getLinkElement().remove();
	        }
	    };
	}

	function parseCurrentDOMHotline() {
		
		var dataForCSV = "shop" + "," + "good" + "," + "price";
		dataForCSV = dataForCSV + '\n';

		//console.log( "shop" + "," + "good" + "," + "price" );

		$('div[class="box-line flex-block flex-stretch cell"]').each(function(index, el) {

			shop = $(el).find('div[class="cell shop-title text-ellipsis"]').text();

			good = $(el).find('div[class="descr block-table"] i').eq(0).text();

			price = $(el).find('div[class="price txt-right cell5 cell-768 m_b-10-768"] a').text();

			//console.log( shop + "," + good + "," + price );
			//replace(/\s{2,}/g, ' ')
			dataForCSV = dataForCSV 

				+ shop.replace(/\s{2,}/g, '').replace(/[,-]/g, '') + "," 

				+ good.replace(/\s{2,}/g, '').replace(/[,-]/g, '') + "," 

				+ price.replace(/\s{2,}/g, '').replace(/[,-]/g, '.');

			dataForCSV = dataForCSV + '\n';

		});

		//console.log( dataForCSV );

		return dataForCSV;

	}

	function parserGoHotline() {
		ajaxStart();

		chrome.tabs.executeScript({
	        code: '('+parseCurrentDOMHotline+')();' 
	    }, (results) => {
	        //console.log(results[0]);
	        downloadCSV(results[0], 'Hotline.csv');
	        //csvGenerator = new CsvGenerator(results[0], 'Hotline.csv');
    		//csvGenerator.download(true);
	    });
 			
		ajaxStop();

	}

	function parseCurrentDOMRozetka() {
		
		var dataForCSV = "code" + "," + "good" + "," + "price" + "," + "available" + "," + "label";
		dataForCSV = dataForCSV + '\n';

		//console.log( "shop" + "," + "good" + "," + "price" );

		$('div[class="g-i-tile-i-box-desc"]').each(function(index, el) {

			code = $(el).find('div[class="g-id"]').text();

			good = $(el).find('div[class="g-i-tile-i-title clearfix"] a').text();

			price = $(el).find('div[class="g-price-uah"] span').eq(0).text();

			available1 = $(el).find('div[class="g-i-status available"]').text().replace(/\s{2,}/g, '');
			available2 = $(el).find('div[class="g-i-status unavailable"]').text().replace(/\s{2,}/g, '');
			available3 = $(el).find('div[class="g-i-status archive"]').text().replace(/\s{2,}/g, '');

			if (available2 == available3) {
				available1 = "В наличии";
			} else {
				available1 = available2 + available3;
			}

			//labelnew = $(el).find('i[class="g-tag g-tag-icon-middle-novelty sprite"]'); 
			//labeltop = $(el).find('i[class="g-tag g-tag-icon-middle-popularity sprite"]');
			//labelsuper = $(el).find('i[class="g-tag g-tag-icon-middle-superprice sprite"]');
			//labelblurb = $(el).find('i[class="g-tag g-tag-icon-middle-action sprite"]');

			if ($(el).find('i[class="g-tag g-tag-icon-middle-novelty sprite"]').length > 0) {
				labelnew = "Новинка";
			} else {
				labelnew = "";
			}

			if ($(el).find('i[class="g-tag g-tag-icon-middle-popularity sprite"]').length > 0) {
				labeltop = "Топ продаж";
			} else {
				labeltop = "";
			}

			if ($(el).find('i[class="g-tag g-tag-icon-middle-superprice sprite"]').length > 0) {
				labelsuper = "Супер цена";
			} else {
				labelsuper = "";
			}

			if ($(el).find('i[class="g-tag g-tag-icon-middle-action sprite"]').length > 0) {
				labelblurb = "Акция";
			} else {
				labelblurb = "";
			}

			labelgood = labelnew + labeltop + labelsuper + labelblurb;

			//console.log( labelnew + "," + labeltop + "," + labelsuper );

			dataForCSV = dataForCSV

				+ code.replace(/\s{2,}/g, '').replace(/[,-]/g, '') + ","

				+ good.replace(/\s{2,}/g, '').replace(/[,-]/g, '') + "," 

				+ price.replace(/\s{2,}/g, '').replace(/[,-]/g, '.') + ","

				+ available1.replace(/\s{2,}/g, '').replace(/[,-]/g, '') + "," 

				+ labelgood; 

			dataForCSV = dataForCSV + '\n';
		});

		return dataForCSV;

	}

	function parserGoRozetka() {
		ajaxStart();

		chrome.tabs.executeScript({
	        code: '('+parseCurrentDOMRozetka+')();' 
	    }, (results) => {
	        //console.log(results[0]);
	        downloadCSV(results[0], 'Rozetka.csv');
	        //csvGenerator = new CsvGenerator(results[0], 'Rozetka.csv');
    		//csvGenerator.download(true);
	    });
 			
		ajaxStop();

	}
	
	$(function() {
		$('#progress').hide();
		$('#starterHotline').click(parserGoHotline);
		$('#starterRozetka').click(parserGoRozetka);
	});

})(jQuery);