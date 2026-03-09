---
title: "Neural Predictive Coding 1: Network"
date: "2026-03-07"
---

If you're anything like me, you're fascinated by the way our brains work. The idea of the average neural network as we see in modern AI is in some ways quite similar to how neurons in our way are structured. In other ways, however, it is absolutely not.

Most of the networks we see are feed-forward and work with some string of inputs resulting in some string of outputs. Even LLMs, or multimodal models, just take their input, create some transformation over it, and give some output. For a lot of LLMs, this means doing it many times over to create enough tokens for sentences, paragraphs, or blocks of code.

And they don't learn while they're doing all of this for you. These are static models, and their weights are - for the most part - set in stone.

Our brains, on the other hand, do a couple of interesting things. While on some scales the human brain has feed-forward structures, much of the brain allows for recurrent connections between neurons. In addition, the information that enters our brain, and the actions that we perform based on that information, is continuous. Information flows in, gets processed, we learn from it, some of it gets committed to memory, and we take actions and make decisions based on this.

So can we simulate a model like this? If we can define it, we can.

## The Leaky-Integrate-and-Fire Model

Of course, we shouldn't get too excited. The brain is a complex system, and neurons do a large amount of things. So we're going to have to simplify. For our neurons, we use a simple Leaky-Integrate-and-Fire model.

$$$
\tau
$$$

This model only defines the inner state of our neurons. We want to keep track of a couple of other variables, which I will explain shortly.

```python
import numpy as np

class Network:
    def __init__(self, layout, dtype=np.float64):
        self.layout = np.array(layout, dtype=np.uint32)
        self.dims   = len(layout)
        self.n      = int(np.prod(layout))
        self.dtype  = dtype

        self.dt                = dtype(0.05)
        self.v_rest            = dtype(0.0)
        self.v_reset           = dtype(10.0)
        self.v_threshold       = dtype(20.0)
        self.tau               = dtype(20.0)
        self.refractory_period = dtype(2.0)
        self.synaptic_delay    = dtype(1.5)
```

We let the layout of our network (the way our neurons are represented in space, for the sake of creating our connections) be in any amount of dimensions. This will help us later, when we experiment with two- and three-dimensional networks.

We also store the amount of neurons in our network, $n$. In addition to this, we store the datatype we use for the calculations in our network. While `float32` or even `float16` would of course have greater performance, we find that the lower accuracy has an effect on how our network behaves. So for now, we'll be using `float64`.

We use discrete timesteps, `dt`, ($\Delta t$). $0.05$ here represents timesteps of 0.05 _miliseconds_, which is somewhere around the highest value we can get away with before the behavior of our network changes.

`v_rest` represents our $u_{rest}$. The value is in _millivolts_. The same goes for `v_reset` and `v_threshold`. These are not variables in our equation, however. These two variables represent something else: When a neuron hits `v_threshold`, it fires, sending a signal to all other neurons it is connected to. `v_reset` is the value it gets immediately after this.

`tau`, $\tau$, is our decay constant. The `refractory_period` represents the amount of time (in milliseconds) it takes for the neuron to recover after it has fired. During this time, it will not react to any outside signals. The `synaptic_delay` is the amount of time it takes for a signal fired from one neuron to reach another neuron.