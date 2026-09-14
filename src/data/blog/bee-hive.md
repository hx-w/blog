---
title: "蜜蜂与蜂群"
pubDatetime: 2026-09-14T09:00:00.000Z
description: "agent已经事实上取代了两年前几乎所有的我需要参与的工作。那接下来我和agent的工作模式，也许需要一次重构"
tags: ["note"]
---

和agent完成相同高质量任务交付的前提下，人类独立完成需要耗费的时间也越来越久。
所以在agent交付成果之前，人类从agent对话窗口解放出来，做其他形式工作的单位时间的价值也越来越高。

<!--more-->

## 背景

在现有的人类的工作种类中，体力劳动的工作环境固定，工人与工地绑定在了一起，人与环境高度耦合；
脑力劳动的工作环境相对轻量，受限于**软硬件资产** 和 **沟通成本** 等因素，需要写字楼工位做环境支撑。

为了更大程度上解放人类有限的时间，也为了避免陷入把人当驴，把agent当做黄金做的磨盘的思维局限性中，探索继脑力劳动之后更加进步的工作模式是必要的。

更具体的，从体力劳动到脑力劳动的演化方式的角度出发，可以认为在能监督agent交付质量的前提下，将agent与人类两者的工作环境解耦，是发生新的形式的劳动的变革的必然条件。

即：

- agent的工作环境是带网络环境的shell。比如macmini里、VPS上或者及NAS里。
- 人类的工作环境是有输入输出设备的可以监视/验收agent成果的地方。比如工位上、KTV包厢里（有液晶屏和话筒）、山上（有手机和麦克风）。

## 前沿实践

**Orca**
https://github.com/stablyai/orca

ADE，端到端集成

核心特点和问题：

1. 移动端友好，自带mobile app，交互现代化
2. 客户端优先，可视化效果好
3. 与harness深度集成，有orca专属的hook和skills。我遇到过codex安装orca的hooks之后，每打开codex tui都需要手动允许hook权限的问题，需要添加启动参数才能解决
4. 功能性问题迭代较慢，体量太大，需要兼顾可视效果、键鼠交互和功能需求，迭代成本高。我频繁遇到过orca创建worktree失败的问题，以及整屏UI乱码的问题。

**herdr**
https://github.com/herdrdev/herdr

herdr是一个后台保活的agent workspace管理工具(tui/cli)

核心特点和问题：

1. cli功能完备（agent原生），可以实现agent操作herdr来控制整个workspace布局，比如新增一个denta worktree的session视图，来处理xxx问题。
2. 后台保活，关terminal/ 关机重启后 自动恢复workspace布局
3. 无侵入性，不对harness添加hook，以及skill，比orca轻量。
4. 社区友好，插件接口完善，可以针对herdr制作插件，让所有harness都受益，避免了codex 无法享受到pi / claude code的插件的尴尬。比如 web+PWA 来转发herdr的https://github.com/AltanS/collie ，一定程度上实现了mobile app的能力。
5. 学习成本高，类tmux的交互逻辑，想要熟练使用需要熟悉新的快捷键，否则在tui上键鼠交互很不直观

herdr最新版本支持 machine add xxx  功能，可以将远程主机上的agent 放到当前主机上的herdr里统一管理会话。
orca也支持（https://www.onorca.dev/docs/ssh）只是还没用过

不过这个功能有一个问题，只支持ssh协议，连接远程主机需要暴露密钥，所以定位上是 个人的多设备agent工作区管理。

herdr官方应该也意识到这个remote多机方案的局限性，准备搞herdr cloud 云端方案解决权限管理等问题（https://herdr.dev/cloud/ ）但是还不知道啥时候上线，而且可能会收费（据说他们刚融了一笔钱，有商业化的趋势）

## 我的方案

可以借鉴分布式的思路，将人类作为master 集群，agent作为slave集群。

更具体的：
1. 打通所有设备的agent workspace，所有agent对其他agent可见，消解掉agent对主机的依赖性，某个主机故障不影响整个agent slave集群，用于解决办公设备的问题。
2. 持续更新并沉淀数字资产（知识库，代码仓库和大文件产物等），并对agent slave集群可见，解决数字资产的问题。
3. master 集群里的所有人可以访问agent slave集群里 以及 数字资产的所有内容，对进行时的和过去时的信息及时同步，解决沟通成本的问题。同时也消解掉任务需求对人类的依赖性，某个人类故障不影响整个master集群，因为所有需要的信息都沉淀在slave集群和数字资产中。

由于herdr已经支持ssh remote的能力，可以选用一个host作为蜂巢hive（比如nas），需要内部公开的host可以注册到hive中（把ssh公钥放到hive主机上）。
这样hive就可以作为ssh的中继站，在某个独立的host上用herdr machine add hive时，hive可以向该host暴露所有的已注册的host 上的agent工作区。实现agent slave集群。

如图：
- Herdr bee 插件运行在agent host上，可以配置hive连接以及公开哪些工作区

![herdr bee 插件的连接配置界面，填写 hive address、visible name、SSH identity 和 enrollment token](/images/hive-bee/herdr-bee-connection.png)

- Herdr hive 运行在中心的服务器上，作为单纯的中继服务（比如办公室nas上）

![herdr hive 服务端状态面板，显示 uptime、SSH 连接数和注册的 bee 列表](/images/hive-bee/herdr-hive-status.png)


接入hive的方式：

```text
安装herdr https://github.com/herdrdev/herdr ，确保版本v0.9.0及以上

根据 https://github.com/deepshape-ai/herdr-hive 安装herdr bee插件

根据插件文档配置密钥，其余的可用信息为：
- hive address: <given by hive service>
- token: <given by hive service>

完成herdr bee的配置
```

以上方案是基于herdr完成的，不过hive-bee模式本质上是ssh的中继，orca也许也可以适配。
