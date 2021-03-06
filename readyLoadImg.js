/**
 * Created by wittbulter on 16/1/4.
 */
;(function (w, d) {
    var _old = w.readyLoadImg;
    if ( typeof module === "object") {
        module.exports = function () {
            return readyLoadImg (w);
        };
        return;
    }
    readyLoadImg(w, d);
    function readyLoadImg(w, d){
        var RLI = function (attrName, srcName, timeOut) {
                this.attrName = attrName ? '' : 'load-img';
                this.srcName = srcName? '' : '-min';
                this.time = timeOut? timeOut : 100;
                this.imageList = [];
                this.bgList = [];
                this.url = '';
                this.img = d.getElementsByTagName('img');
                this.background = false;
                _this = this;
            },
            getBackGround = function (attrName) {
                var list = [];
                var nodes = document.getElementsByTagName('*'),
                    length = nodes.length;
                for(var i = 0; i < length; i ++){
                    if (nodes[i].getAttribute (attrName) != null) {
                        if (nodes[i].tagName != 'IMG') {
                            list.push(nodes[i]);
                        }
                    }
                }
                return list;
            },
            setImage = function (url, img, list, bg) {
                var timeOut = setTimeout(function () {
                    var time = setInterval(function () {
                        if (img[img.length - 1].complete) {
                            for(var i = 0; i < img.length; i ++){
                                if (bg) {
                                    return list[i].style.backgroundImage = 'url(' + url[i] + ')';
                                }
                                list[i].setAttribute('src', url[i]);
                            }
                            w.clearInterval(time);
                            w.clearTimeout(timeOut);
                        }
                    },300);
                },_this.time);
            };
        RLI.prototype = {
            version: '0.0.1',
            bgToggle: function (toggle) {
                this.background = toggle;
            },
            getMin: function (){    //获得所有需要再次加载的img
                var _loadList = [],
                    _bgList = [],
                    _bgUrlList = [];
                var style;
                if (this.background) {
                    _bgList = getBackGround(this.attrName);
                    for(var i = 0; i < _bgList.length; i++){
                        style = d.defaultView.getComputedStyle (_bgList[i])['backgroundImage'];
                        if (style && style.length > 6) {
                            if (style.split ('"')[1] && style.split ('"')[1].indexOf(this.srcName) >= 0) {
                                this.bgList.push(_bgList[i]);
                                _bgUrlList.push(style.split ('"')[1].split(this.srcName)[0] + style.split ('"')[1].split(this.srcName)[1]);
                            }
                        }
                    }
                }
                for(var i = 0; i < this.img.length; i ++){
                    if (this.img[i].getAttribute (this.attrName) != null) {
                        this.url = this.img[i].getAttribute ('src');
                        if (this.url && this.url.length > 0 && this.url.indexOf(this.srcName) >= 0) {
                            this.imageList.push(this.img[i]);
                            _loadList.push(this.url.split(this.srcName)[0] + this.url.split(this.srcName)[1]);
                        }
                    }
                }
                return [_loadList, _bgUrlList];
            },
            preLoad: function (arr) {
                var _img = [];
                if (typeof arr == 'object') {
                    if (typeof arr[0] == 'object') {
                        arr.forEach(function (value, index) {
                            _img[index] = new Image();
                            _img[index].src = value.url;
                        })
                        return _img;
                    }
                    arr.forEach(function (value, index) {
                        _img[index] = new Image();
                        _img[index].src = value;
                    })
                    return _img;
                }
            },
            start: function () {
                w.onload = function () {
                    var url = _this.getMin();
                    if (_this.background && url[1] && url[1].length >= 1) {
                        img = _this.preLoad(url[1]);
                        setImage(url[1], img, _this.bgList, true);
                    }
                    if (! _this.background && url[0] && url[0].length >= 1) {
                        img = _this.preLoad(url[0]);
                        setImage(url[0], img, _this.imageList);
                    }
                }
            },
            delay: function (setTime) {
                var _loadList = [],
                    _image = [],
                    _imagePre = [];
                setTime ? '' : setTime = 2000;
                for(var i = 0; i < this.img.length; i ++){
                    if (this.img[i].getAttribute ('delay-img') != null) {
                        this.url = this.img[i].getAttribute ('src');
                        this.img[i].setAttribute('src','');
                        _image.push(this.img[i]);
                        _loadList.push(this.url);
                    }
                }
                var timeOut = setTimeout(function () {
                    _imagePre = _this.preLoad(_loadList);
                    var time = setInterval(function () {
                        if (_imagePre[_imagePre.length - 1].complete) {
                            for(var i = 0; i < _image.length; i ++){
                                _image[i].setAttribute('src', _loadList[i]);
                            }
                            w.clearInterval(time);
                            w.clearTimeout(timeOut);
                        }
                    },300);
                },setTime);
            },
            old: _old
        };

        if (typeof define === "function" && define.amd ) {
            define('readyLoadImg',[], function() {
                return RLI;
            });
        }
        w.readyLoadImg = RLI;
    }
})(window, document);








