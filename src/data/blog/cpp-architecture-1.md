---
title: "C++-架构之路"
pubDatetime: 2021-09-16T07:40:58.000Z
tags: ["cpp"]
description: "我的c++架构之路-1  异步  feature 当在一个线程中，创建了一个异步操作（asynchronous operations）时，该异步操作会返回一个对象，可以通过其访问异步操作的状态和结果等。 创建异步操作一般有三种方式：、和"
---

我的c++架构之路-1

<!--more-->

# 异步

## feature

当在一个线程中，创建了一个异步操作（asynchronous operations）时，该异步操作会返回一个`feature`对象，可以通过其访问异步操作的状态和结果等。

创建异步操作一般有三种方式：`std::async`、`std::packaged_task`和`std::promise`

