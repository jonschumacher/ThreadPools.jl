module TestAqua

using Test
using ThreadPools
using Aqua


@testset "Aqua" begin
    Aqua.test_all(ThreadPools)
end

end # module