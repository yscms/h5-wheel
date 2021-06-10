/**
 * 定义当前页面全局变量
 */
var prizeCount  = 0; // 奖励项数量
var prizeDeg    = 0; // 大装盘转动偏移角度
var count       = 0; // 剩余抽奖次数
var freeCount   = 0; // 免费抽奖次数
var watchCount  = 0; // 看视频抽奖次数
var score       = 0; // 每次抽奖消耗积分
var myScore     = 0; // 我的积分
var isDouble    = false; // 是否翻倍积分奖励
var pid         = 0; // 当前奖项ID

/**
 * 加载当前JS文件操作
 */
onload = function () {

    /**
     * 判断Token是否存在
     */
    if (!token) {
        isFlag = false;
        return false;
    }

    /**
     * 初始化大转盘
     */
        // 请求大转盘数据并渲染
        $.ajax({
            url: wheel_index,
            type: 'get',
            headers: {
                "token": token,
                "Accept": "application/json",
                "appid": appId
            },
            success:function (res) {
                console.log(res)
                if (res.code != 0) {
                    isFlag = false;
                    return false;
                }

                $('body').css('height', 'auto');

                if (res.data.count < 0) {
                    res.data.count = 0;
                }

                // 用户中奖信息
                if (res.data.record) {
                    record(res.data.record);
                }

                // 渲染抽奖奖励项
                if (res.data.prize) {
                    prize(res.data.prize);
                }

                // 剩余免费抽奖机会
                if (res.data.count) {
                    $('#prize-count').html(res.data.count);
                    count = res.data.count;
                }

                // 渲染中奖配置信息
                if (res.data.wheel_config) {
                    rule(res.data.wheel_config);
                }

                // 我的积分
                if (res.data.score) {
                    $('#my-score').html(res.data.score);
                    myScore = res.data.score;
                }
            },
            error:function (res) {
                console.log(res)
            }
        });

        // 用户中奖记录滚动
        function record(data) {
            var content = '';
            for(var i=0; i<data.length; i++) {
                content += "<div class=\"swiper-slide\">\n" +
                    data[i]['member_nickname'].substr(0,1) + "****" + data[i]['member_nickname'].substr(data[i]['member_nickname'].length-1, 1)
                    + " 抽中<span class=\"tips-color\">" + data[i]['prize_title'] +"</span>\n" +
                    "       </div>";
            }

            $('.swiper-wrapper').html(content);

            var mySwiper = new Swiper('.swiper-box .swiper-container', {
                direction: 'vertical',
                loop: $(".swiper-box .swiper-slide").length > 2, // 循环
                autoplay: {
                    delay: 3000,
                    stopOnLastSlide: false,
                    disableOnInteraction: true,
                }
            });
        }

        // 大转盘填充奖项
        function prize(data) {
            var list = '';
            var reward = '';
            var count = data.length;
            var rotate = 360/count;

            prizeCount = count;
            prizeDeg   = 360/count;

            var itemRotate = 360/2/count;
            var liRotate   = 0;

            // 4、6、8、10、12数量奖项
            var width;
            switch (count) {
                case 2:
                    liRotate   = 0;
                    width = 4;
                    break;
                case 4:
                    liRotate   = 0;
                    width = 3;
                    break;
                case 6:
                    liRotate   = 30;
                    width = 2;
                    break;
                case 8:
                    liRotate   = 45;
                    width = 1.5;
                    break;
                case 10:
                    liRotate   = 54;
                    width = 1.3;
                    break;
                case 12:
                    liRotate   = 60;
                    width = 1;
                    break;
                default:
                    liRotate   = 0;
                    width = 1;
            }

            for(var i=0; i<count; i++) {
                list += "<div class=\"prize-li\"></div>";
                reward += "<div class=\"prize-item\" data-id=\"" + data[i]['id'] + "\" style=\"transform: rotate(" + (rotate*(i+1) - itemRotate) + "deg) translateX(-50%);width: " + width + "rem;\">\n" +
                    "                                <div class=\"prize-name\">\n" +
                    data[i]['title'] +
                    "                                </div>\n" +
                    "                                <div class=\"prize-icon\">\n" +
                    "                                    <img src=\"" + data[i]['icon'] + "\">\n" +
                    "                                </div>\n" +
                    "                            </div>"
            }

            $('#prize-list').html(list);
            $('#prize-reward').html(reward);

            [].slice.call(document.querySelectorAll('.prize-li'), 0).forEach(function (item, i) {
                if(count == 2) {
                    return false;
                }
                item.style.backgroundColor = '#ffffff';
                if(i%2 == 0) {
                    item.style.backgroundColor = '#FCE9C1';
                }
                item.style.transform = 'rotate(' + (360 / count * i + liRotate) + 'deg) skewX(' + liRotate +'deg)';
            });

            if(count == 2) {
                $('#prize-list').find('.prize-li').css('width', '2.49rem');
                $('#prize-list').find('.prize-li').css('height', '4.98rem');
                $('#prize-list').find('.prize-li').css('top', '0rem');
                $('#prize-list').find('.prize-li').css('left', '0rem');
                $('#prize-list').find('.prize-li').eq(0).css('background', '#FCE9C1');
                $('#prize-list').find('.prize-li').eq(1).css('left', '2.49rem');
            }
        }

        // 渲染配置信息
        function rule(data) {

            $('.consume-score').html(data.consume_score);
            var ruleArr = data.activity_rule.split('\n');
            var content = '';

            for (i=0; i<ruleArr.length; i++) {
                content += "<div class=\"rule_li\">" + ruleArr[i] + "</div>";
            }

            isDouble = data.is_open_double_reward;
            if (!data.is_open_double_reward) {
                $('#go-watch').html('好的');
            }

            $('.activity_rule').css('display', 'block');
            $('#activity-rule').html(content);
            $('#watch-lottery').html(data.watch_advert_lottery_num);
            freeCount  = data.free_presented_num;
            watchCount = data.watch_advert_lottery_num;
            score = data.consume_score;
        }

    /**
     * 抽奖相关操作
     */
        // 加锁，用户不能连续点击
        var flag = true;

        // 免费抽奖
        $('#prize-button').click(function () {
            times();
            if (!flag || !isFlag) {
                return false;
            }
            flag = false;

            if (count <= 0) { // 免费机会用完，积分抽奖
                scoreLottery();
                return false;
            }

            if (count <= watchCount) { // 免费次数已用完
                $('#mask').css('display', 'block');
                $('#watch-prize').css('display', 'block');
                flag = true;
                return false;
            }

            lottery(1);
        });

        // 选择积分抽奖
        $('#lottery-score').click(function () {
            times();
            if (!flag || !isFlag) {
                return false;
            }
            flag = false;

            $('#mask').css('display', 'none');
            $('#watch-prize').css('display', 'none');
            scoreLottery();
        });

        // 积分抽奖
        function scoreLottery()
        {
            if (score > myScore) { // 积分不足
                $('#mask').css('display', 'none');
                $('#watch-prize').css('display', 'none');
                $('#score-tips').css('display', 'block');
                setTimeout(function () {
                    $('#score-tips').css('display', 'none');
                    flag = true;
                }, 3000);
                return false;
            }

            lottery(2);
        }

        // 看视频抽奖
        $('#lottery-watch').click(function () {
            times();
            if (!isFlag) {
                return false;
            }

            if (count <= 0) { // 看视频机会用完
                return false;
            }

            if (phone_type == 'android') {
                decoObject.watch(JSON.stringify({'type': 'wheel-surf', 'token': token}));
            } else {
                window.webkit.messageHandlers.watch.postMessage(JSON.stringify({
                    'type': 'wheel-surf',
                    'token': token
                }));
            }
        });

        // 看视频抽奖，视频回调事件
        function watchCallback() {
            $('#mask').css('display', 'none');
            $('#watch-prize').css('display', 'none');

            //抽奖
            lottery(3);
        }

        // 更新抽奖次数、用户积分
        function times() {
            $.ajax({
                url: wheel_times,
                type: 'get',
                headers: {
                    "token": token,
                    "Accept": "application/json",
                    "appid": appId
                },
                success:function (res) {
                    if (!res.data) {
                        isFlag = false;
                        return false;
                    }

                    var data = res.data;
                    count       = data.count;
                    score       = data.wheel_config.consume_score;
                    myScore     = data.score;
                    freeCount   = data.wheel_config.free_presented_num;
                    watchCount  = data.wheel_config.watch_advert_lottery_num;

                    $('#my-score').html(myScore);
                    $('#prize-count').html(count);
                    $('.consume-score').html(score);
                    $('#watch-lottery').html(data.wheel_config.watch_advert_lottery_num);
                },
                error:function(res) {
                }
            })
        }

        // 抽奖操作
        function lottery(type)
        {
            $.ajax({
                url: wheel_lottery,
                type: 'get',
                headers: {
                    "token": token,
                    "Accept": "application/json",
                    "appid": appId
                },
                data: {
                    type: type
                },
                success:function (res) {
                    console.log(res);
                    if (!res.data) {
                        flag = true;
                        return false;
                    }

                    var type    = res.data.type;
                    var title   = res.data.title;
                    var img     = res.data.img;
                    var rid     = res.data.record_id;
                    myScore     = res.data.my_score;
                    pid         = res.data.prize_id;

                    // 更新积分及抽奖次数等信息
                    count--;
                    $('#prize-count').html(count);

                    // 获取当前奖项标签的下标
                    var code = $("#prize-reward").find(".prize-item[data-id=" + pid + "]").index();

                    if(code == -1) { // 未查询到标签
                        flag = true;
                        return false;
                    }

                    // 转盘转动
                    var e = 3600 - (code * prizeDeg) - prizeDeg/2;
                    $('.prize-content').css({'transition': 'transform 6s cubic-bezier(0.25, 0.1, 0.01, 1)', 'transform': "rotate(" + e + "deg)"});

                    setTimeout(function () { // 消息提示
                        $('#mask').css('display', 'block');
                        $('#my-score').html(myScore);
                        if (type == 1) {
                            $('#prize-score').css('display', 'block');
                            $('#result-img').attr('src', img);
                            $('#result-score').html(title);
                        } else if(type == 2) {
                            $('#prize-result').css('display', 'block');
                            $('#result-icon').attr('src', img);
                            $('#result-reward').html(title);
                            $('#go-write').attr('data-id', rid)
                        } else {
                            $('#prize-no').css('display', 'block');
                        }

                        //转盘复位
                        $('.prize-content').css({'transition': '','transform': "rotate(0deg)"});

                        flag = true;
                    }, 6000);
                },
                error:function(res) {
                }
            })
        }

    /**
     * 弹窗相关操作
     */
        // 关闭奖励弹窗
        $('#close-prize').click(function () {
            $('#mask').css('display', 'none');
            $('#prize-result').css('display', 'none');
        });

        // 关闭看视频弹窗
        $('#close-watch').click(function () {
            $('#mask').css('display', 'none');
            $('#watch-prize').css('display', 'none');
        });

        // 关闭虚拟奖励弹窗
        $('#close-score').click(function () {
            $('#mask').css('display', 'none');
            $('#prize-score').css('display', 'none');
        });

        // 关闭未中奖弹窗
        $('#close-no').click(function () {
            $('#mask').css('display', 'none');
            $('#prize-no').css('display', 'none');
        });

        $('#go-try').click(function () {
            $('#mask').css('display', 'none');
            $('#prize-no').css('display', 'none');
        });

    /**
     * 看视频相关操作及触发客户端JS时间
     */
        // 看视频翻倍积分奖励
        $('#go-watch').click(function () {
            if (!isDouble) { // 未开启
                $('#mask').css('display', 'none');
                $('#prize-score').css('display', 'none');
                return false;
            }

            if (phone_type == 'android') {
                decoObject.watch(JSON.stringify({'type': 'wheel-surf', 'token': token}));
            } else {
                window.webkit.messageHandlers.watch.postMessage(JSON.stringify({
                    'type': 'wheel-surf',
                    'token': token
                }));
            }
        });

        // 看视频抽奖，积分双倍奖励回调事件
        function watchCallback() {
            $('#mask').css('display', 'none');
            $('#prize-score').css('display', 'none');

            // 积分翻倍
            if (pid == 0) {
                return false;
            }
        }

        // 跳转，填写收货地址
        $('#go-write').click(function () {
            if (!token) {
                return false;
            }
            var id = $(this).attr('data-id');
            window.location.href = 'info.html?id=' + id + '&token=' + token;

            var link =  'info.html?id=' + id + '&token=' + token;
            var title = '收货信息';
            if (phone_type == 'android') {
                decoObject.webview(JSON.stringify({"url": link, 'title': title}));
            } else {
                window.webkit.messageHandlers.webview.postMessage(JSON.stringify({"url": link, 'title': title}));
            }
        });

        // 跳转，中奖记录
        $('#go-record').click(function () {
            if (!token) {
                return false;
            }
            window.location.href = 'record.html?token=' + token;

            var link =  'record.html?token=' + token;
            var title = '中奖记录';
            if (phone_type == 'android') {
                decoObject.webview(JSON.stringify({"url": link, 'title': title}));
            } else {
                window.webkit.messageHandlers.webview.postMessage(JSON.stringify({"url": link, 'title': title}));
            }
        });

};
