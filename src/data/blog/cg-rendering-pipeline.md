---
title: "计算机图形学-实时渲染管线"
pubDatetime: 2020-12-01T02:17:35.000Z
tags: ["graphics", "note"]
description: "概述 记录描述计算机图形学中 实时渲染管线 (Real-time Rendering Pipeline)的内容。  渲染流水线 整个流程都是在硬件(显卡)中实现的。 整理流程可以认为包括三大部分：几何图形处理(顶点和三角形变换)，光栅化和Fragment处理。  Fragments可以理解为像素，如..."
---

## 概述

记录描述计算机图形学中 **实时渲染管线** (Real-time Rendering Pipeline)的内容。

<!--more-->

## 渲染流水线

![](/images/cg-pipeline/CG-4-1.png)

整个流程都是在硬件(显卡)中实现的。

整理流程可以认为包括三大部分：几何图形处理(顶点和三角形变换)，光栅化和Fragment处理。

> Fragments可以理解为像素，如果做了MSAA，那么多个Fragments会组成一个像素。

将我们记录的计算机图形学中的渲染流程对应到流水线上：

### MVP变换

![](/images/cg-pipeline/CG-4-2.png)

在`Vertex Processing`过程中完成。
