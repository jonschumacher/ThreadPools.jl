var documenterSearchIndex = {"docs":
[{"location":"#ThreadPools.jl","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Improved thread management for background and nonuniform tasks","category":"page"},{"location":"#Overview","page":"ThreadPools.jl","title":"Overview","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Documentation at https://tro3.github.io/ThreadPools.jl","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"ThreadPools.jl is a simple package that exposes a few macros and functions that mimic Base.Threads.@threads, Base.map, and Base.foreach. These  macros (and the underlying API) handle cases that the built-in functions are  not always well-suited for:","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"A group of tasks that the user wants to keep off of the primary thread\nA group of tasks that are very nonuniform in duration","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"For the first case, ThreadPools exposes a @bthreads (\"background threads\")  macro that behaves identically to Threads.@threads, but keeps the primary thread job-free.  There are also related bmap and bforeach functions that mimic their Base counterparts, but with the same non-primary  thread usage.","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"For the second case, the package exposes a @qthreads (\"queued threads\")  macro. This macro uses a different scheduling strategy to help with nonuniform jobs.  @threads and @bthreads first divide the incoming job list into equal job  \"chunks\", then launch each  chunk on a separate thread for processing.  If the jobs are not uniform, this can lead to some long jobs all getting assigned to one thread, delaying  completion.  @qthreads does not pre-assign threads - it only starts a new  job as an old one finishes, so if a long job comes along, the other threads  will keep operating on the shorter ones.  @qthreads itself does use the  primary thread, but its cousin @qbthreads uses the same strategy  but in the background. There are also qmap, qforeach,  qbmap, and qbforeach.","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"The package also exposes a lower-level @tspawnat macro that mimics the  Base.Threads.@spawn macro, but allows direct thread assignment for users who want  to develop their own scheduling.","category":"page"},{"location":"#Simple-Macro/Function-Selection","page":"ThreadPools.jl","title":"Simple Macro/Function Selection","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Task Type Foreground (primary allowed) Background (primary forbidden)\nUniform tasks Base.Threads.@threads ThreadPools.tmap(fn, itrs) ThreadPools.tforeach(fn, itrs) ThreadPools.@bthreads ThreadPools.bmap(fn, itrs) ThreadPools.bforeach(fn, itrs)\nNonuniform tasks ThreadPools.@qthreads ThreadPools.qmap(fn, itrs) ThreadPools.qforeach(fn, itrs) ThreadPools.@qbthreads ThreadPools.qbmap(fn, itrs) ThreadPools.qbforeach(fn, itrs)","category":"page"},{"location":"#Job-Logging-for-Performance-Tuning","page":"ThreadPools.jl","title":"Job Logging for Performance Tuning","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Each of the above macros comes with a logging version that allows the user to  analyze the performance of the chosen strategy and thread count:","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Task Type Foreground Background\nUniform tasks ThreadPools.@logthreads ThreadPools.logtmap(fn, itrs) ThreadPools.logtforeach(fn, itrs) ThreadPools.@logbthreads ThreadPools.logbmap(fn, itrs) ThreadPools.logbforeach(fn, itrs)\nNonuniform tasks ThreadPools.@logqthreads ThreadPools.logqmap(fn, itrs) ThreadPools.logqforeach(fn, itrs) ThreadPools.@logqbthreads ThreadPools.logqbmap(fn, itrs) ThreadPools.logqbforeach(fn, itrs)","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Please see below for usage examples.","category":"page"},{"location":"#Usage","page":"ThreadPools.jl","title":"Usage","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Each of the simple API functions can be used like the Base versions of the  same function: ","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"julia> @qbthreads for x in 1:3\r\n         println(\"$x $(Threads.threadid())\")\r\n       end\r\n2 3\r\n3 4\r\n1 2\r\n\r\njulia> bmap([1,2,3]) do x\r\n         println(\"$x $(Threads.threadid())\")\r\n         x^2\r\n       end\r\n2 3\r\n3 4\r\n1 2\r\n3-element Array{Int64,1}:\r\n 1\r\n 4\r\n 9\r\n\r\njulia> t = @tspawnat 4 Threads.threadid()\r\nTask (runnable) @0x0000000010743c70\r\n\r\njulia> fetch(t)\r\n4","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Note that both of the above examples use the background versions and no  threadid==1 is seen.  Also note that while the execution order is not  guaranteed across threads, but the result of bmap will of course match  the input. ","category":"page"},{"location":"#Logger-Usage","page":"ThreadPools.jl","title":"Logger Usage","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"The logging versions of the above functions all produce an AbstractThreadPool  object that has an in-memory log of the start and stop times of each job that  ran through the pool.  A PlotRecipe from RecipesBase is exposed in the  package, so all that is needed to generate a visualization of the job times is  the plot command from Plots.  In these plots, each job is shown by index, start time, and stop time and is given a color corresponding to its thread:","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"julia> using Plots\r\n\r\njulia> pool = logtforeach(x -> sleep(0.1*x), 1:8);\r\n\r\njulia> plot(pool)","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"(Image: tforeach plot)","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"julia> pool = logqforeach(x -> sleep(0.1*x), 1:8);\r\n\r\njulia> plot(pool)","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"(Image: qforeach plot)","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Note the two different scheduling strategies are seen in the above plots. The  tforeach log shows that the jobs were assigned in order: 1 & 2 to  thread 1, 3 & 4 to thread 2, and so on.  The qforeach shows that each job (any thread) is started when the previous job on that thread completes. Because these jobs are very nonuniform (and stacked against the first strategy), this results in the pre-assign method taking 25% longer.","category":"page"},{"location":"#Simple-API","page":"ThreadPools.jl","title":"Simple API","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Each function of the simple API tries to mimic an existing function in Base  or Base.Threads to keep any code rework to a minimum.","category":"page"},{"location":"#Regular-Versions","page":"ThreadPools.jl","title":"Regular Versions","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"@bthreads\n@qthreads\n@qbthreads\ntmap(fn, itr)\nbmap(fn, itr)\nqmap(fn, itr)\nqbmap(fn, itr)\ntforeach(fn, itr)\nbforeach(fn, itr)\nqforeach(fn, itr)\nqbforeach(fn, itr)","category":"page"},{"location":"#Logging-Versions","page":"ThreadPools.jl","title":"Logging Versions","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"@logthreads\n@logbthreads\n@logqthreads\n@logqbthreads\nlogtmap(fn, itr)\nlogbmap(fn, itr)\nlogqmap(fn, itr)\nlogqbmap(fn, itr)\nlogtforeach(fn, itr)\nlogbforeach(fn, itr)\nlogqforeach(fn, itr)\nlogqbforeach(fn, itr)","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"@bthreads\r\n@qthreads\r\n@qbthreads\r\ntmap(fn::Function, itr)\r\nbmap(fn, itr)\r\nqmap(fn, itr)\r\nqbmap(fn, itr)\r\ntforeach(fn::Function, itr)\r\nbforeach(fn, itr)\r\nqforeach(fn, itr)\r\nqbforeach(fn, itr)\r\n\r\n@logthreads\r\n@logbthreads\r\n@logqthreads\r\n@logqbthreads\r\nlogtmap(fn::Function, itr)\r\nlogbmap(fn, itr)\r\nlogqmap(fn, itr)\r\nlogqbmap(fn, itr)\r\nlogtforeach(fn::Function, itr)\r\nlogbforeach(fn, itr)\r\nlogqforeach(fn, itr)\r\nlogqbforeach(fn, itr)\r\n\r\n@tspawnat","category":"page"},{"location":"#ThreadPools.@bthreads","page":"ThreadPools.jl","title":"ThreadPools.@bthreads","text":"@bthreads\n\nMimics Base.Threads.@threads, but keeps the iterated tasks off if the primary  thread.\n\nExample\n\njulia> @bthreads for x in 1:8\n         println((x, Threads.threadid()))\n       end\n(1, 2)\n(6, 4)\n(3, 3)\n(7, 4)\n(4, 3)\n(8, 4)\n(5, 3)\n(2, 2)\n\nNote that execution order is not guaranteed, but the primary thread does not show up on any of the jobs.\n\n\n\n\n\n","category":"macro"},{"location":"#ThreadPools.@qthreads","page":"ThreadPools.jl","title":"ThreadPools.@qthreads","text":"@qthreads\n\nMimics Base.Threads.@threads, but uses a task queueing strategy, only starting  a new task when an previous one (on any thread) has completed.  This can provide performance advantages when the iterated tasks are very nonuniform in length.  The primary thread is used.  To prevent usage of the primary thread, see  @qbthreads.\n\nExample\n\njulia> @qthreads for x in 1:8\n         println((x, Threads.threadid()))\n       end\n(2, 4)\n(3, 3)\n(4, 2)\n(5, 4)\n(6, 3)\n(7, 2)\n(8, 4)\n(1, 1)\n\nNote that execution order is not guaranteed and the primary thread is used.\n\n\n\n\n\n","category":"macro"},{"location":"#ThreadPools.@qbthreads","page":"ThreadPools.jl","title":"ThreadPools.@qbthreads","text":"@qbthreads\n\nMimics Base.Threads.@threads, but uses a task queueing strategy, only starting  a new task when an previous one (on any thread) has completed.  This can provide performance advantages when the iterated tasks are very nonuniform in length.  The primary thread is not used.  To allow usage of the primary thread, see  @qthreads.\n\nExample\n\njulia> @qbthreads for x in 1:8\n         println((x, Threads.threadid()))\n       end\n(2, 4)\n(3, 2)\n(1, 3)\n(4, 4)\n(5, 2)\n(6, 3)\n(7, 4)\n(8, 2)\n\nNote that execution order is not guaranteed, but the primary thread does not show up on any of the jobs.\n\n\n\n\n\n","category":"macro"},{"location":"#ThreadPools.tmap-Tuple{Function,Any}","page":"ThreadPools.jl","title":"ThreadPools.tmap","text":"tmap(fn, itrs...) -> collection\n\nMimics Base.map, but launches the function evaluations onto all available  threads, using a pre-assigned scheduling strategy appropriate for uniform task durations.\n\nExample\n\njulia> tmap(x -> begin; println((x,Threads.threadid())); x^2; end, 1:8)'\n(7, 4)\n(5, 3)\n(8, 4)\n(1, 1)\n(6, 3)\n(2, 1)\n(3, 2)\n(4, 2)\n1×8 LinearAlgebra.Adjoint{Int64,Array{Int64,1}}:\n 1  4  9  16  25  36  49  64\n\nNote that while the execution order is not guaranteed, the result order is.  Also note that the primary thread is used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.bmap-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.bmap","text":"bmap(fn, itrs...) -> collection\n\nMimics Base.map, but launches the function evaluations onto all available  threads except the primary, using a pre-assigned scheduling strategy  appropriate for uniform task durations.\n\nExample\n\njulia> bmap(x -> begin; println((x,Threads.threadid())); x^2; end, 1:8)'\n(6, 4)\n(1, 2)\n(3, 3)\n(2, 2)\n(4, 3)\n(7, 4)\n(5, 3)\n(8, 4)\n1×8 LinearAlgebra.Adjoint{Int64,Array{Int64,1}}:\n 1  4  9  16  25  36  49  64\n\nNote that while the execution order is not guaranteed, the result order is,  Also note that the primary thread is not used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.qmap-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.qmap","text":"qmap(fn, itrs...) -> collection\n\nMimics Base.map, but launches the function evaluations onto all available  threads, using a queued scheduling strategy appropriate for nonuniform task durations.\n\nExample\n\njulia> qmap(x -> begin; println((x,Threads.threadid())); x^2; end, 1:8)'\n(2, 3)\n(3, 2)\n(4, 4)\n(5, 3)\n(6, 2)\n(7, 4)\n(8, 3)\n(1, 1)\n1×8 LinearAlgebra.Adjoint{Int64,Array{Int64,1}}:\n 1  4  9  16  25  36  49  64\n\nNote that while the execution order is not guaranteed, the result order is.  Also note that the primary thread is used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.qbmap-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.qbmap","text":"qbmap(fn, itrs...) -> collection\n\nMimics Base.map, but launches the function evaluations onto all available  threads except the primary, using a queued scheduling strategy appropriate  for nonuniform task durations.\n\nExample\n\njulia> qbmap(x -> begin; println((x,Threads.threadid())); x^2; end, 1:8)'\n(2, 3)\n(1, 2)\n(3, 4)\n(5, 2)\n(4, 3)\n(6, 4)\n(7, 2)\n(8, 3)\n1×8 LinearAlgebra.Adjoint{Int64,Array{Int64,1}}:\n 1  4  9  16  25  36  49  64\n\nNote that while the execution order is not guaranteed, the result order is,  Also note that the primary thread is not used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.tforeach-Tuple{Function,Any}","page":"ThreadPools.jl","title":"ThreadPools.tforeach","text":"tforeach(fn, itrs...)\n\nMimics Base.foreach, but launches the function evaluations onto all available  threads, using a pre-assigned scheduling strategy appropriate for uniform task durations.\n\nExample\n\njulia> tforeach(x -> println((x,Threads.threadid())), 1:8)\n(1, 1)\n(3, 2)\n(5, 3)\n(2, 1)\n(7, 4)\n(4, 2)\n(8, 4)\n(6, 3)\n\nNote that the execution order is not guaranteed, and that the primary thread  is used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.bforeach-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.bforeach","text":"bforeach(fn, itrs...)\n\nMimics Base.foreach, but launches the function evaluations onto all available  threads except the primary, using a pre-assigned scheduling strategy appropriate  for uniform task durations.\n\nExample\n\njulia> bforeach(x -> println((x,Threads.threadid())), 1:8)\n(1, 2)\n(6, 4)\n(2, 2)\n(7, 4)\n(8, 4)\n(3, 3)\n(4, 3)\n(5, 3)\n\nNote that the execution order is not guaranteed, and that the primary thread  is not used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.qforeach-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.qforeach","text":"qforeach(fn, itrs...)\n\nMimics Base.foreach, but launches the function evaluations onto all available  threads, using a queued scheduling strategy appropriate for nonuniform task durations.\n\nExample\n\njulia> qforeach(x -> println((x,Threads.threadid())), 1:8)\n(4, 3)\n(2, 2)\n(3, 4)\n(5, 3)\n(6, 2)\n(7, 4)\n(8, 3)\n(1, 1)\n\nNote that the execution order is not guaranteed, and that the primary thread  is used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.qbforeach-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.qbforeach","text":"qbforeach(fn, itrs...)\n\nMimics Base.foreach, but launches the function evaluations onto all available  threads except the primary, using a queued scheduling strategy appropriate for  nonuniform task durations.\n\nExample\n\njulia> qbforeach(x -> println((x,Threads.threadid())), 1:8)\n(3, 3)\n(2, 4)\n(1, 2)\n(4, 3)\n(5, 4)\n(6, 2)\n(7, 3)\n(8, 4)\n\nNote that the execution order is not guaranteed, and that the primary thread  is not used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.@logthreads","page":"ThreadPools.jl","title":"ThreadPools.@logthreads","text":"@logthreads -> pool\n\nMimics Base.Threads.@threads.  Returns a logged pool that can be analyzed with  the logging functions and plotted.\n\nExample\n\njulia> pool = @logthreads for x in 1:8\n         println((x, Threads.threadid()))\n       end;\n(1, 1)\n(5, 3)\n(7, 4)\n(2, 1)\n(6, 3)\n(8, 4)\n(3, 2)\n(4, 2)\n\njulia> plot(pool)\n\nNote that execution order is not guaranteed and the primary thread is used.\n\n\n\n\n\n","category":"macro"},{"location":"#ThreadPools.@logbthreads","page":"ThreadPools.jl","title":"ThreadPools.@logbthreads","text":"@logbthreads -> pool\n\nMimics Base.Threads.@threads, but keeps the iterated tasks off if the primary  thread.  Returns a logged pool that can be analyzed with the logging functions  and plotted.\n\nExample\n\njulia> pool = @logbthreads for x in 1:8\n         println((x, Threads.threadid()))\n       end;\n(3, 4)\n(2, 3)\n(1, 2)\n(4, 4)\n(5, 3)\n(6, 2)\n(8, 3)\n(7, 4)\n\njulia> plot(pool)\n\nNote that execution order is not guaranteed, but the primary thread does not show up on any of the jobs.\n\n\n\n\n\n","category":"macro"},{"location":"#ThreadPools.@logqthreads","page":"ThreadPools.jl","title":"ThreadPools.@logqthreads","text":"@logqthreads -> pool\n\nMimics Base.Threads.@threads, but uses a task queueing strategy, only starting  a new task when an previous one (on any thread) has completed.  Returns a logged  pool that can be analyzed with the logging functions and plotted. The primary  thread is used.  To prevent usage of the primary thread, see  @logqbthreads.\n\nExample\n\njulia> pool = @logqthreads for x in 1:8\n         println((x, Threads.threadid()))\n       end;\n(1, 1)\n(3, 2)\n(7, 4)\n(5, 3)\n(2, 1)\n(8, 4)\n(6, 3)\n(4, 2)\n\njulia> plot(pool)\n\nNote that execution order is not guaranteed and the primary thread is used.\n\n\n\n\n\n","category":"macro"},{"location":"#ThreadPools.@logqbthreads","page":"ThreadPools.jl","title":"ThreadPools.@logqbthreads","text":"@logqbthreads -> pool\n\nMimics Base.Threads.@threads, but uses a task queueing strategy, only starting  a new task when an previous one (on any thread) has completed.  Returns a logged  pool that can be analyzed with the logging functions and plotted. The primary  thread is not used.  To allow usage of the primary thread, see  @logqthreads.\n\nExample\n\njulia> pool = @logqbthreads for x in 1:8\n         println((x, Threads.threadid()))\n       end;\n(2, 3)\n(1, 4)\n(3, 2)\n(4, 3)\n(5, 4)\n(6, 2)\n(7, 3)\n(8, 4)\n\njulia> plot(pool)\n\nNote that execution order is not guaranteed, but the primary thread does not show up on any of the jobs.\n\n\n\n\n\n","category":"macro"},{"location":"#ThreadPools.logtmap-Tuple{Function,Any}","page":"ThreadPools.jl","title":"ThreadPools.logtmap","text":"logtmap(fn, itrs...) -> (pool, collection)\n\nMimics Base.map, but launches the function evaluations onto all available  threads, using a pre-assigned scheduling strategy appropriate for uniform task durations.  Also returns a logged pool that can be analyzed with  the logging functions and plotted.\n\nExample\n\njulia> (pool, result) = logtmap(1:8) do x\n         println((x,Threads.threadid()))\n         x^2\n       end;\n(1, 1)\n(3, 2)\n(7, 4)\n(5, 3)\n(8, 4)\n(4, 2)\n(2, 1)\n(6, 3)\n\njulia> result'\n1×8 LinearAlgebra.Adjoint{Int64,Array{Int64,1}}:\n1  4  9  16  25  36  49  64\n\njulia> plot(pool)\n\nNote that while the execution order is not guaranteed, the result order is.  Also note that the primary thread is used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.logbmap-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.logbmap","text":"logbmap(fn, itrs...) -> (pool, collection)\n\nMimics Base.map, but launches the function evaluations onto all available  threads except the primary, using a pre-assigned scheduling strategy  appropriate for uniform task durations.  Also returns a logged pool that can  be analyzed with the logging functions and plotted.\n\nExample\n\njulia> (pool, result) = logbmap(1:8) do x\n         println((x,Threads.threadid()))\n         x^2\n       end;\n(1, 2)\n(6, 4)\n(3, 3)\n(7, 4)\n(2, 2)\n(4, 3)\n(8, 4)\n(5, 3)\n\njulia> result'\n1×8 LinearAlgebra.Adjoint{Int64,Array{Int64,1}}:\n1  4  9  16  25  36  49  64\n\njulia> plot(pool)\n\nNote that while the execution order is not guaranteed, the result order is,  Also note that the primary thread is not used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.logqmap-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.logqmap","text":"logqmap(fn, itrs...) -> (pool, collection)\n\nMimics Base.map, but launches the function evaluations onto all available  threads, using a queued scheduling strategy appropriate for nonuniform task durations.  Also returns a logged pool that can be analyzed with the  logging functions and plotted.\n\nExample\n\njulia> (pool, result) = logqmap(1:8) do x\n         println((x,Threads.threadid()))\n         x^2\n        end;\n(3, 3)\n(4, 4)\n(2, 2)\n(5, 3)\n(7, 2)\n(6, 4)\n(8, 3)\n(1, 1)\n\njulia> result'\n1×8 LinearAlgebra.Adjoint{Int64,Array{Int64,1}}:\n1  4  9  16  25  36  49  64\n\njulia> plot(pool)\n\nNote that while the execution order is not guaranteed, the result order is.  Also note that the primary thread is used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.logqbmap-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.logqbmap","text":"logqbmap(fn, itrs...) -> (pool, collection)\n\nMimics Base.map, but launches the function evaluations onto all available  threads except the primary, using a queued scheduling strategy appropriate  for nonuniform task durations.  Also returns a logged pool that can be  analyzed with the logging functions and plotted.\n\nExample\n\njulia> (pool, result) = logqbmap(1:8) do x\n         println((x,Threads.threadid()))\n         x^2\n       end;\n(3, 3)\n(2, 4)\n(1, 2)\n(4, 3)\n(5, 4)\n(6, 2)\n(7, 3)\n(8, 4)\n\njulia> result'\n1×8 LinearAlgebra.Adjoint{Int64,Array{Int64,1}}:\n1  4  9  16  25  36  49  64\n\njulia> plot(pool)\n\nNote that while the execution order is not guaranteed, the result order is,  Also note that the primary thread is not used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.logtforeach-Tuple{Function,Any}","page":"ThreadPools.jl","title":"ThreadPools.logtforeach","text":"logtforeach(fn, itrs...) -> pool\n\nMimics Base.foreach, but launches the function evaluations onto all available  threads, using a pre-assigned scheduling strategy appropriate for uniform task durations.  Returns a logged pool that can be analyzed with  the logging functions and plotted.\n\nExample\n\njulia> pool = logtforeach(x -> println((x,Threads.threadid())), 1:8);\n(1, 1)\n(3, 2)\n(7, 4)\n(2, 1)\n(4, 2)\n(5, 3)\n(8, 4)\n(6, 3)\n\njulia> plot(pool)\n\nNote that the execution order is not guaranteed, and that the primary thread  is used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.logbforeach-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.logbforeach","text":"logbforeach(fn, itrs...)\n\nMimics Base.foreach, but launches the function evaluations onto all available  threads except the primary, using a pre-assigned scheduling strategy appropriate  for uniform task durations.  Returns a logged pool that can be analyzed with  the logging functions and plotted.    \n\nExample\n\njulia> pool = logbforeach(x -> println((x,Threads.threadid())), 1:8);\n(1, 2)\n(3, 3)\n(6, 4)\n(4, 3)\n(2, 2)\n(7, 4)\n(5, 3)\n(8, 4)\n\njulia> plot(pool)\n\nNote that the execution order is not guaranteed, and that the primary thread  is not used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.logqforeach-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.logqforeach","text":"logqforeach(fn, itrs...)\n\nMimics Base.foreach, but launches the function evaluations onto all available  threads, using a queued scheduling strategy appropriate for nonuniform task durations.\n\nExample\n\njulia> pool = logqforeach(x -> println((x,Threads.threadid())), 1:8);\n(2, 4)\n(3, 3)\n(4, 2)\n(5, 4)\n(6, 3)\n(7, 2)\n(8, 4)\n(1, 1)\n\njulia> plot(pool)\n\nNote that the execution order is not guaranteed, and that the primary thread  is used.  Returns a logged pool that can be analyzed with the logging functions  and plotted.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.logqbforeach-Tuple{Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.logqbforeach","text":"logqbforeach(fn, itrs...)\n\nMimics Base.foreach, but launches the function evaluations onto all available  threads except the primary, using a queued scheduling strategy appropriate for  nonuniform task durations.  Returns a logged pool that can be analyzed with the  logging functions and plotted.\n\nExample\n\njulia> pool = logqbforeach(x -> println((x,Threads.threadid())), 1:8);\n(2, 2)\n(1, 3)\n(3, 4)\n(4, 2)\n(5, 3)\n(6, 4)\n(7, 2)\n(8, 3)\n\njulia> plot(pool)\n\nNote that the execution order is not guaranteed, and that the primary thread  is not used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.@tspawnat","page":"ThreadPools.jl","title":"ThreadPools.@tspawnat","text":"@tspawnat tid -> task\n\nMimics Base.Threads.@spawn, but assigns the task to thread tid.\n\nExample\n\njulia> t = @tspawnat 4 Threads.threadid()\nTask (runnable) @0x0000000010743c70\n\njulia> fetch(t)\n4\n\n\n\n\n\n","category":"macro"},{"location":"#Composable-API","page":"ThreadPools.jl","title":"Composable API","text":"","category":"section"},{"location":"#Functions","page":"ThreadPools.jl","title":"Functions","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"The above macros invoke two base structures, ThreadPools.StaticPool and  ThreadPools.QueuePool, each of which can be assigned to a subset of the  available threads.  This allows for composition with the pwith and @pthreads  commands, and usage in more complex scenarios, such as stack processing.","category":"page"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"twith(fn::Function, pool)\r\n@tthreads\r\ntmap(fn::Function, pool, itr)\r\ntforeach(pool, fn::Function, itr::AbstractVector)","category":"page"},{"location":"#ThreadPools.twith-Tuple{Function,Any}","page":"ThreadPools.jl","title":"ThreadPools.twith","text":"twith(fn, pool) -> pool\n\nApply the functon fn to the provided pool and close the pool.  Returns the  closed pool for any desired analysis or plotting. \n\nExample\n\njulia> twith(ThreadPools.QueuePool(1,2)) do pool\n         tforeach(x -> println((x,Threads.threadid())), pool, 1:8)\n       end;\n(2, 2)\n(1, 1)\n(3, 2)\n(4, 1)\n(5, 2)\n(6, 1)\n(7, 2)\n(8, 1)\n\nNote in the above example, only two threads were used, as set by the  QueuePool setting.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.@tthreads","page":"ThreadPools.jl","title":"ThreadPools.@tthreads","text":"@tthreads pool\n\nMimic the Base.Threads.@threads macro, but uses the provided pool to  assign the tasks.\n\nExample\n\njulia> twith(ThreadPools.QueuePool(1,2)) do pool\n         @tthreads pool for x in 1:8\n           println((x,Threads.threadid()))\n         end\n       end;\n(2, 2)\n(3, 2)\n(1, 1)\n(4, 2)\n(5, 1)\n(6, 2)\n(8, 2)\n(7, 1)\n\n\n\n\n\n","category":"macro"},{"location":"#ThreadPools.tmap-Tuple{Function,Any,Any}","page":"ThreadPools.jl","title":"ThreadPools.tmap","text":"tmap(fn, itrs...) -> collection\n\nMimics Base.map, but launches the function evaluations onto all available  threads, using a pre-assigned scheduling strategy appropriate for uniform task durations.\n\nExample\n\njulia> tmap(x -> begin; println((x,Threads.threadid())); x^2; end, 1:8)'\n(7, 4)\n(5, 3)\n(8, 4)\n(1, 1)\n(6, 3)\n(2, 1)\n(3, 2)\n(4, 2)\n1×8 LinearAlgebra.Adjoint{Int64,Array{Int64,1}}:\n 1  4  9  16  25  36  49  64\n\nNote that while the execution order is not guaranteed, the result order is.  Also note that the primary thread is used.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.tforeach-Tuple{Any,Function,AbstractArray{T,1} where T}","page":"ThreadPools.jl","title":"ThreadPools.tforeach","text":"tforeach(fn, itrs...)\n\nMimics Base.foreach, but launches the function evaluations onto all available  threads, using a pre-assigned scheduling strategy appropriate for uniform task durations.\n\nExample\n\njulia> tforeach(x -> println((x,Threads.threadid())), 1:8)\n(1, 1)\n(3, 2)\n(5, 3)\n(2, 1)\n(7, 4)\n(4, 2)\n(8, 4)\n(6, 3)\n\nNote that the execution order is not guaranteed, and that the primary thread  is used.\n\n\n\n\n\n","category":"method"},{"location":"#AbstractThreadPool","page":"ThreadPools.jl","title":"AbstractThreadPool","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"Base.close(pool::ThreadPools.StaticPool)","category":"page"},{"location":"#Base.close-Tuple{ThreadPools.StaticPool}","page":"ThreadPools.jl","title":"Base.close","text":"Base.close(pool::AbstractThreadPool)\n\nCloses the pool, shuts down any handlers and finalizes any logging activities. \n\n\n\n\n\n","category":"method"},{"location":"#StaticPools","page":"ThreadPools.jl","title":"StaticPools","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"ThreadPools.StaticPool()\r\nThreadPools.LoggedStaticPool()","category":"page"},{"location":"#ThreadPools.StaticPool-Tuple{}","page":"ThreadPools.jl","title":"ThreadPools.StaticPool","text":"StaticPool(init_thrd=1, nthrds=Threads.nthreads())\n\nThe main StaticPool object.   \n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.LoggedStaticPool-Tuple{}","page":"ThreadPools.jl","title":"ThreadPools.LoggedStaticPool","text":"LoggedStaticPool(init_thrd=1, nthrds=Threads.nthreads())\n\nThe main LoggedStaticPool object.\n\n\n\n\n\n","category":"method"},{"location":"#QueuePools","page":"ThreadPools.jl","title":"QueuePools","text":"","category":"section"},{"location":"","page":"ThreadPools.jl","title":"ThreadPools.jl","text":"ThreadPools.QueuePool()\r\nThreadPools.LoggedQueuePool()\r\nBase.put!(pool::ThreadPools.QueuePool, t::Task)\r\nBase.put!(pool::ThreadPools.QueuePool, fn::Function, args...)\r\nBase.take!(pool::ThreadPools.QueuePool)\r\nBase.iterate(pool::ThreadPools.QueuePool, state)\r\nresults(pool::ThreadPools.QueuePool)\r\nisactive(pool::ThreadPools.QueuePool)","category":"page"},{"location":"#ThreadPools.QueuePool-Tuple{}","page":"ThreadPools.jl","title":"ThreadPools.QueuePool","text":"QueuePool(init_thrd=1, nthrds=Threads.nthreads())\n\nThe main QueuePool object. Its API mimics that of a Channel{Task}, but each submitted task is executed on a different thread.  If allow_primary is true,  the assigned thread might be the primary, which will interfere with future  thread management for the duration of any heavy-computational (blocking) processes.  If it is false, all assigned threads will be off of the primary. Each thread will only be allowed one Task at a time, but each thread will  backfill with the next queued Task immediately on completion of the previous, without regard to how bust the other threads may be.  \n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.LoggedQueuePool-Tuple{}","page":"ThreadPools.jl","title":"ThreadPools.LoggedQueuePool","text":"LoggedQueuePool(init_thrd=1, nthrds=Threads.nthreads())\n\nThe main LoggedQueuePool object. Its API mimics that of a Channel{Task}, but each submitted task is executed on a different thread.  If allow_primary is true,  the assigned thread might be the primary, which will interfere with future  thread management for the duration of any heavy-computational (blocking) processes.  If it is false, all assigned threads will be off of the primary. Each thread will only be allowed one Task at a time, but each thread will  backfill with the next queued Task immediately on completion of the previous, without regard to how bust the other threads may be.\n\nThe API for the LoggedQueuePool is Identical to that for QueuePool.\n\n\n\n\n\n","category":"method"},{"location":"#Base.put!-Tuple{ThreadPools.QueuePool,Task}","page":"ThreadPools.jl","title":"Base.put!","text":"Base.put!(pool::QueuePool, t::Task)\n\nPut the task t into the pool, blocking until the pool has an available thread.\n\n\n\n\n\n","category":"method"},{"location":"#Base.put!-Tuple{ThreadPools.QueuePool,Function,Vararg{Any,N} where N}","page":"ThreadPools.jl","title":"Base.put!","text":"Base.put!(pool::QueuePool, fn, args...)\nBase.put!(fn, pool::QueuePool, args...)\n\nCreates a task that runs fn(args...) and adds it to the pool, blocking  until the pool has an available thread.\n\n\n\n\n\n","category":"method"},{"location":"#Base.take!-Tuple{ThreadPools.QueuePool}","page":"ThreadPools.jl","title":"Base.take!","text":"Base.take!(pool::QueuePool) -> Task\n\nTakes the next available completed task from the pool, blocking until a task is available.  \n\n\n\n\n\n","category":"method"},{"location":"#Base.iterate-Tuple{ThreadPools.QueuePool,Any}","page":"ThreadPools.jl","title":"Base.iterate","text":"Base.iterate(pool::QueuePool[, state])\n\nIterates over the completed Tasks, grabbing the next one available and ending when the pool has been closeed.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.results-Tuple{ThreadPools.QueuePool}","page":"ThreadPools.jl","title":"ThreadPools.results","text":"results(pool::QueuePool) -> result iterator\n\nReturns an iterator over the fetched results of the pooled tasks.\n\nExample\n\njulia> pool = QueuePool();\n\njulia> @async begin\n         for i in 1:4\n           put!(pool, x -> 2*x, i)\n         end\n         close(pool)\n       end;\n\njulia> for r in results(pool)\n         println(r)\n       end\n6\n2\n4\n8\n\nNote that the execution order across the threads is not guaranteed.\n\n\n\n\n\n","category":"method"},{"location":"#ThreadPools.isactive-Tuple{ThreadPools.QueuePool}","page":"ThreadPools.jl","title":"ThreadPools.isactive","text":"ThreadPools.isactive(pool::QueuePool)\n\nReturns true if there are queued Tasks anywhere in the pool, either awaiting execution, executing, or waiting to be retrieved.\n\n\n\n\n\n","category":"method"}]
}
