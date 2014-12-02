(function ($) {
    var _p,_com,
        _options={
            ajax:{
                dataType: "json",
                httpType:"get",
            },
            Asyn:true
        };

    function _LoadData(p, d) {
        if (p.attr("isload") === "true") {
            if (!p.attr("root")) 
                p.children("ul").show();
            return;
        }
        $.ajax(_options.url,{
            data:d,
            type:_options.ajax.httpType,
            dataType:_options.ajax.dataType,
            success: function (data) {
                _fillData(p, data);
            }
        });
    }

    //阻止冒泡排序
    function _stopPropagation(event){
        if (event && event.stopPropagation) {
            //W3C取消冒泡事件
            event.stopPropagation();
        } else {
            //IE取消冒泡事件
            window.event.cancelBubble = true;
        }
    }

    function _fillData(p,data) {
        p.attr("isload", "true");//标识已加载数据

        var up=p.find("ul");
        if(up.length<=0){
            up=$("<ul></ul>").attr("id",p.attr("id")+"-ul").appendTo(p);
        }
        //填充数据
        $.each(data,function(i,obj){
            var li = $("<li></li>").attr("id", up.attr("id") + "-" + i).attr("tid", obj.id).attr("val", obj.value);
            var item = $("<div><div>").appendTo(li).attr("val", obj.value);     //下拉项
            // 是否下级
            if (obj.isparent) {
                if (_options.Asyn) {        //是否是异步加载数据
                    // 添加展开/隐藏按钮
                    $("<span></span>").addClass("tree-icon").addClass("tree-expand").appendTo(item)
                        .bind("click", function (event) {            //绑定点击展开项事件
                            _stopPropagation(event);    // 禁止事件冒泡
                            var _li = $(this).parent().parent();
                            if ($(this).hasClass("tree-expand")) {
                                $(this).addClass("tree-expanded").removeClass("tree-expand");                               
                                $(this).next("span").addClass("tree-folder-open").removeClass("tree-folder");                               
                                //加载数据
                                _LoadData(_li, { Pid: _li.attr("tid") });
                            } else {
                                _li.children("ul").hide();
                                $(this).next("span").addClass("tree-folder").removeClass("tree-folder-open");
                                $(this).addClass("tree-expand").removeClass("tree-expanded");
                            }
                        });
                } else {
                    if (obj.child) {
                        _fillData(li, obj.child);
                    }
                }
                $("<span></span>").addClass("tree-icon").addClass("tree-folder").appendTo(item);
            } else {
                $("<span></span>").addClass("tree-icon").addClass("tree-item").appendTo(item);
            }

            var la = $("<a></a>").text(obj.text).appendTo(item);    //文本                 
            up.append(li);
        });
        //赋值给文本框
        up.find("div").bind("click", function () {
            //$($(this).parents(".comboxTree-panal").attr("bind"))
            _com.val($(this).text()).attr("comval", $(this).attr("val"));                    
        })
    }

    //下拉框树
    function _comboxTreeInit(e, o){
        $("body").click(function () { $(".comboxTree-panal").hide(); });

        _options = $.extend(_options, o);

        e.addClass("comboxTree");
        _p = $("<div></div>").attr("url", _options.url).attr("root","true").attr("id", "cTree-" + e.attr("id")).addClass("comboxTree-panal")
            .attr("bind", e.attr("id"))
            .appendTo(e.parent()).hide();

        if (e.width() > 160) {
            _p.width(e.width());
        }

        $(e).bind("click", function (event) {
            //event.stopPropagation();// 禁止事件冒泡
            _stopPropagation(event);

            _com = $(this);
            _p = $("div[bind=" + e.attr("id") + "]");
            _options.url = _p.attr("url");
            _p.show();
            _LoadData(_p);
        });

        $(e).bind("blur", function () {
            if ($(e).val() == "") {
                $(e).removeAttr("comval");
            }
        });
    }

    $.fn.ComboxTree = function (e, o) {
        if (typeof e === "string") {
            var m=$.fn.ComboxTree.methods[e];
            if(m)
               return m(this,o);
        }

        if (typeof e === "object")
            _comboxTreeInit(this, e);
    }

    $.fn.ComboxTree.methods = {
        options: function (op) { },
        loadData: function () {

        },
        GetValue: function (e) {
            return $(e).attr("comval") ? $(e).attr("comval") : "";
        }
    }
    //end 下拉框树

    //树
    function _treeInit(e, o) {
        _options = $.extend(_options, o);

        e.addClass("tree");
        _p = $("<div></div>").attr("url", _options.url).attr("root", "true").attr("id", "tree-" + e.attr("id")).addClass("tree-panal")
            .attr("bind", e.attr("id"))
            .appendTo(e.parent()).hide();
        $(e).bind("click", function () {
            event.stopPropagation();// 禁止事件冒泡
            _com = $(this);
            _p = $("div[bind=" + e.attr("id") + "]");
            _options.url = _p.attr("url");
            _p.show();
            _LoadData(_p);
        });
    }
    $.fn.Tree = function (e, o) {
        if (typeof e === "string") {
            var m = $.fn.Tree.methods[e];
            if (m)
                return m(this, o);
        }

        if (typeof e === "object")
            _treeInit(this, e);
    }

    $.fn.Tree.methods = {
        GetValue: function (e) {
            return $(e).attr("comval") ? $(e).attr("comval") : "";
        }
    }

})(jQuery)