---
title: "Garmin表盘开发入门：Monkey C与Connect IQ完全指南"
pubDatetime: 2026-03-09T09:00:00.000Z
description: "以开源项目Segment34为例，系统介绍Garmin表盘开发的全流程：Monkey C语言、Connect IQ SDK、项目结构、自定义字体、后台服务、编译部署。"
tags: ["tutorial", "tools"]
draft: false
---

最近想给Garmin手表装一个好看的表盘，在GitHub上发现了[Segment34](https://github.com/ludw/Segment34mkII)这个开源项目——采用复古的34段数码管显示风格，集成了心率、天气、月相等多种数据，视觉上非常独特。

既然是开源项目，正好可以借着阅读源码的机会，系统梳理一下Garmin表盘开发的完整流程。

先看一下成品效果。后面提到的布局、字体、天气图标和后台数据刷新，都会落实到这个表盘界面上。

![Segment34 表盘在 Garmin 手表上的实际效果](/images/garmin-watchface-dev/segment34-screenshot.png)

<!--more-->

## Connect IQ平台概述

Connect IQ是Garmin的第三方应用生态，开发者可以为Garmin手表创建：

- **Watchface**：表盘，始终显示在屏幕上
- **App**：独立应用，用户手动启动
- **Widget**：小部件，从表盘滑动进入
- **Data Field**：数据字段，嵌入到运动模式中

表盘开发是最常见的场景，因为它直接面向用户，每次抬手都能看到。

## 开发环境搭建

### 安装Connect IQ SDK

从Garmin开发者网站下载SDK：

```text
https://developer.garmin.com/connect-iq/sdk/
```

macOS默认安装路径：

```bash
~/Library/Application Support/Garmin/ConnectIQ/
```

### VS Code扩展

推荐使用VS Code开发，安装 **Garmin Connect IQ** 扩展，提供：

- Monkey C语法高亮和补全
- 模拟器调试
- 一键构建

### 开发者密钥

发布应用需要签名密钥：

```bash
openssl genrsa -out developer_key.pem 4096
openssl pkcs8 -topk8 -inform PEM -outform DER \
    -in developer_key.pem \
    -out developer_key.der -nocrypt
```

## Monkey C语言

Monkey C是Garmin专门为Connect IQ设计的编程语言，语法类似Java和Dart，但针对嵌入式设备做了优化。

> 由于astro markdown组件没有对monkey-c进行语法高亮的优化，所以下面关于monkey-c的代码都以typescript语法高亮（写法挺像的）。

### 基本语法

```typescript
using Toybox.Application;
using Toybox.WatchUi;
using Toybox.System;

class MyWatchFace extends WatchUi.WatchFace {
    
    // 构造函数
    function initialize() {
        WatchFace.initialize();
    }
    
    // 布局加载
    function onLayout(dc as Dc) as Void {
        setLayout(Rez.Layouts.WatchFace(dc));
    }
    
    // 每帧更新
    function onUpdate(dc as Dc) as Void {
        var clockTime = System.getClockTime();
        var label = View.findDrawableById("TimeLabel") as Text;
        label.setText(clockTime.hour.format("%02d"));
        View.onUpdate(dc);
    }
}
```

### 核心模块

Monkey C通过`Toybox`命名空间组织API：

| 模块 | 功能 |
|------|------|
| `Toybox.Application` | 应用生命周期、存储 |
| `Toybox.WatchUi` | 表盘UI框架 |
| `Toybox.System` | 系统信息、时钟 |
| `Toybox.Graphics` | 图形绘制 |
| `Toybox.Time` | 时间处理 |
| `Toybox.Lang` | 基础类型 |
| `Toybox.Communications` | 网络请求 |
| `Toybox.Background` | 后台服务 |
| `Toybox.SensorHistory` | 传感器历史数据 |
| `Toybox.Weather` | 天气数据 |

### 类型系统

Monkey C是强类型语言，支持以下类型：

```typescript
// 基本类型
var number = 42;           // Number
var text = "Hello";        // String
var flag = true;           // Boolean
var pi = 3.14;             // Float/Double

// 集合类型
var arr = [1, 2, 3];       // Array
var dict = {               // Dictionary
    "key" => "value",
    "count" => 10
};

// 类型声明
function add(a as Number, b as Number) as Number {
    return a + b;
}
```

## 项目结构

一个标准的Connect IQ表盘项目结构如下：

```text
MyWatchFace/
├── manifest.xml           # 应用清单
├── monkey.jungle          # 构建配置
├── source/
│   ├── MyWatchFaceApp.mc  # 应用入口
│   └── MyWatchFaceView.mc # 表盘视图
├── resources/
│   ├── layouts/
│   │   └── layout.xml     # UI布局
│   ├── fonts/
│   │   ├── fonts.xml      # 字体配置
│   │   └── *.fnt          # 字体文件
│   ├── drawables/
│   │   ├── drawables.xml  # 图标配置
│   │   └── *.png          # 图标资源
│   └── strings/
│       └── strings.xml    # 多语言字符串
├── resources-round-240x240/  # 多尺寸适配
└── build/                 # 编译输出
```

### manifest.xml

应用清单声明了设备支持、权限等信息：

```xml
<?xml version="1.0"?>
<iq:manifest version="3" xmlns:iq="http://www.garmin.com/xml/connectiq">
    <iq:application 
        id="your-app-uuid" 
        type="watchface" 
        name="@Strings.AppName" 
        entry="MyWatchFaceApp"
        minApiLevel="3.2.0">
        
        <iq:products>
            <iq:product id="fenix7"/>
            <iq:product id="fr255"/>
        </iq:products>
        
        <iq:permissions>
            <iq:uses-permission id="Positioning"/>
            <iq:uses-permission id="SensorHistory"/>
        </iq:permissions>
    </iq:application>
</iq:manifest>
```

### layout.xml

使用XML声明式布局：

```xml
<layout id="WatchFace">
    <label id="TimeLabel" 
           x="center" y="90" 
           font="@Fonts.id_segments80" 
           justification="Graphics.TEXT_JUSTIFY_CENTER" 
           color="0xFFFF00"/>
    
    <bitmap id="WeatherIcon" 
            x="120" y="50" 
            filename="../drawables/weather.png"/>
</layout>
```

在代码中引用：

```typescript
function onUpdate(dc as Dc) as Void {
    var timeLabel = View.findDrawableById("TimeLabel") as Text;
    timeLabel.setText("12:34");
    View.onUpdate(dc);
}
```

## 以Segment34为例学习表盘开发

[Segment34](https://github.com/ludw/Segment34mkII)是GitHub上的一个开源Garmin表盘项目，作者hurricane312采用复古的34段数码管显示风格，视觉效果非常出色。这篇文章以它作为学习案例，分析一个成熟表盘项目是如何组织的。

### 功能特性

Segment34实现了以下功能：

- 时间显示（34段数码管风格）
- 月相图形化显示
- 心率实时监测
- 天气信息（温度、风速、天气图标）
- 日出/日落时间
- 日期和ISO周数
- 通知计数
- 恢复时间
- 周活动分钟数
- 步数统计
- 电池状态
- 压力和Body Battery

### 数据源

看看这个项目是如何整合传感器数据的：

```typescript
// 心率
var activityInfo = Activity.getActivityInfo();
var hr = activityInfo.currentHeartRate;

// 或从历史数据获取
var sample = ActivityMonitor.getHeartRateHistory(1, true).next();

// 步数
var steps = ActivityMonitor.getInfo().steps;

// 天气
var weather = Weather.getCurrentConditions();
var temp = weather.temperature;

// 电池
var battery = System.getSystemStats().battery;
```

### 自定义字体

Segment34使用自定义位图字体实现数码管效果：

```xml
<fonts>
    <font id="id_segments80" filename="segments80.fnt" 
          antialias="true" filter="#1234567890:"/>
    <font id="id_led" filename="led.fnt" 
          antialias="false" filter="0123456789-"/>
    <font id="id_moon" filename="moon.fnt" antialias="true"/>
</fonts>
```

`filter`属性限制了可显示的字符集，减小字体文件体积。

### 天气图标

项目内置了多种天气状态图标：

| 图标 | 天气 |
|------|------|
| ![多云天气图标](/images/garmin-watchface-dev/w_cloudy.png) | 多云 |
| ![下雨天气图标](/images/garmin-watchface-dev/w_rain.png) | 下雨 |
| ![下雪天气图标](/images/garmin-watchface-dev/w_snow.png) | 下雪 |

### 月相显示

使用自定义字体实现月相图形化：

![月相字体对应的 8 种月相字形](/images/garmin-watchface-dev/moon-font.png)

月相计算算法：

```typescript
hidden function moon_phase(time) {
    var jd = julian_day(time.year, time.month, time.day);
    var days_since_new_moon = jd - 2459966;
    var lunar_cycle = 29.53;
    var phase = ((days_since_new_moon / lunar_cycle) * 100).toNumber() % 100;
    var into_cycle = (phase / 100.0) * lunar_cycle;

    if (into_cycle < 3) return "0";      // 新月
    else if (into_cycle < 6) return "1"; // 蛾眉月
    else if (into_cycle < 10) return "2";
    else if (into_cycle < 14) return "3"; // 上弦月
    else if (into_cycle < 18) return "4"; // 盈凸月
    else if (into_cycle < 22) return "5"; // 满月
    else if (into_cycle < 26) return "6"; // 亏凸月
    else if (into_cycle < 29) return "7"; // 残月
    else return "0";
}
```

### 屏幕适配

支持多种屏幕尺寸：

```typescript
function setStressAndBodyBattery(dc) as Void {
    var barTop = 91;
    var fromEdge = 10;
    
    if (dc.getHeight() == 240) {
        barTop = 81;
        fromEdge = 6;
    }
    if (dc.getHeight() == 280) {
        fromEdge = 14;
    }
    
    dc.fillRectangle(fromEdge, barTop, 3, 80);
}
```

对应的资源目录：

```text
resources/                    # 默认 (260x260)
resources-round-240x240/      # 240x240 屏幕
resources-round-280x280/      # 280x280 屏幕
```

这种多资源目录的设计值得借鉴——新建设备支持时只需复制布局文件并调整坐标，无需在代码中硬编码太多分支。
## 编译与部署

### 命令行构建

```bash
monkeyc -o MyWatchFace.prg \
        -f monkey.jungle \
        -y developer_key.der \
        -w
```

### VS Code一键构建

```text
Cmd+Shift+P → "Monkey C: Build for Device"
```

### 安装到手表

**方法一：USB传输**

```bash
cp build/fenix7/MyWatchFace.prg /Volumes/GARMIN/Apps/
```

**方法二：模拟器调试**

VS Code中选择 "Run in Simulator"，在模拟器中预览效果。

### 发布到Connect IQ Store

打包发布版本：

```bash
monkeyc -o MyWatchFace.iq \
        -f monkey.jungle \
        -y developer_key.der \
        -r -e 2
```

然后上传到 [Garmin Developer Portal](https://apps.garmin.com/) 提交审核。

## 网络请求与后台服务

表盘需要从网络获取自定义数据时，不能直接在`onUpdate()`中请求，因为每次亮屏都会调用，会导致卡顿和耗电。

### 架构设计

正确做法是使用后台服务定时请求，然后缓存到本地：

```text
┌─────────────────────────────────────────────────────────────────┐
│                    网络请求架构                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐     每5-30分钟      ┌─────────────────┐    │
│  │  后台服务        │ ─────────────────→ │  API 服务器      │    │
│  │  ServiceDelegate│                    │                 │    │
│  └────────┬────────┘                    └─────────────────┘    │
│           │                                                     │
│           │ Background.exit(data)                               │
│           ↓                                                     │
│  ┌─────────────────┐                                            │
│  │   本地存储缓存   │                                            │
│  │  Storage.setValue│                                           │
│  └────────┬────────┘                                            │
│           │                                                     │
│           │ 亮屏时读取                                           │
│           ↓                                                     │
│  ┌─────────────────┐                                            │
│  │  WatchFace View  │                                            │
│  │  onUpdate()      │                                            │
│  └─────────────────┘                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 后台服务实现

```typescript
(:background)
class CustomDataService extends System.ServiceDelegate {
    
    function onTemporalEvent() {
        Communications.makeWebRequest(
            "https://api.example.com/data",
            {},
            {
                :method => Communications.HTTP_REQUEST_METHOD_GET,
                :responseType => Communications.HTTP_RESPONSE_CONTENT_TYPE_TEXT_ENUM
            },
            method(:onResponse)
        );
    }
    
    function onResponse(responseCode, data) {
        if (responseCode == 200 && data != null) {
            Application.Storage.setValue("customData", data["fields"]);
            Application.Storage.setValue("lastUpdate", Time.now().value());
        }
        Background.exit(null);
    }
}
```

在应用入口注册：

```typescript
(:background)
class MyApp extends Application.AppBase {
    
    function initialize() {
        AppBase.initialize();
        
        // 注册后台服务，最小间隔5分钟
        if (Background.getTemporalEventRegisteredTime() == null) {
            Background.registerForTemporalEvent(new Time.Duration(15 * 60));
        }
    }
    
    public function getServiceDelegate() as [System.ServiceDelegate] {
        return [new CustomDataService()];
    }
}
```

### 表盘读取缓存

```typescript
class MyView extends WatchUi.WatchFace {
    
    var cachedData = null;
    
    function onShow() {
        cachedData = Application.Storage.getValue("customData");
    }
    
    function onUpdate(dc as Dc) as Void {
        if (cachedData != null) {
            var label = View.findDrawableById("CustomLabel") as Text;
            label.setText(cachedData["value"].toString());
        }
        View.onUpdate(dc);
    }
}
```

### 限制与注意事项

| 限制 | 说明 |
|------|------|
| 最小请求间隔 | 5分钟 |
| 数据存储大小 | 单项最大32KB |
| 后台服务内存 | 有限制，避免大量处理 |
| manifest权限 | 需声明`Communications`权限 |

## 支持的设备

Segment34支持广泛的Garmin设备：

| 系列 | 设备型号 |
|------|----------|
| Fenix 6 | fenix6, fenix6pro, fenix6s, fenix6xpro |
| Fenix 7 | fenix7, fenix7pro, fenix7s, fenix7x |
| Fenix 8 | fenix8solar 47mm/51mm |
| Forerunner | fr245, fr255, fr745, fr945, fr955 |
| Enduro | enduro, enduro3 |
| Descent | descentmk2, descentmk2s |
| MARQ | 全系列 |
| Vivoactive | vivoactive4 |

添加新设备支持只需在manifest.xml中添加product id，或通过VS Code命令`Monkey C: Edit Products`操作。

## 调试技巧

### 日志输出

```typescript
function onUpdate(dc as Dc) as Void {
    System.println("Debug: onUpdate called");
    System.println("Width: " + dc.getWidth());
}
```

在模拟器控制台查看日志输出。

### 常见错误码

| 错误码 | 含义 |
|--------|------|
| -200 | 请求被取消 |
| -201 | 无网络连接 |
| -202 | 连接超时 |
| -203 | 数据解析失败 |
| -403 | 权限问题（Fenix 6常见） |

## 小结

通过分析Segment34这个开源项目，可以学到Garmin表盘开发的几个关键点：

- **项目结构**：manifest.xml声明设备支持，layout.xml定义UI，.mc文件编写逻辑
- **自定义字体**：使用位图字体和filter属性实现特殊显示效果
- **数据整合**：Toybox提供的传感器API非常丰富，心率、天气、步数等都有现成接口
- **屏幕适配**：通过多资源目录和动态坐标计算兼容不同分辨率
- **后台服务**：网络请求必须通过ServiceDelegate实现，最小间隔5分钟

如果想基于Segment34二次开发，可以直接fork项目修改。如果从零开始，建议先用VS Code的Connect IQ扩展创建模板项目，再逐步添加功能。


## 参考资料

- [Connect IQ SDK文档](https://developer.garmin.com/connect-iq/overview/)
- [Monkey C API参考](https://developer.garmin.com/connect-iq/api-docs/)
- [Connect IQ开发者论坛](https://forums.garmin.com/developer/connect-iq/)
- [GitHub Connect IQ示例](https://github.com/garmin/connectiq-apps)
