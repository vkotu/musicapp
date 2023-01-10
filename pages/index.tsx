import { Box, Text, Flex } from '@chakra-ui/layout'
import { Image, Skeleton } from '@chakra-ui/react'
import GradientLayout from '../components/gradientLayout'
import { useMe } from '../lib/hooks'
import prisma from '../lib/prisma'
import { validateToken } from '../lib/auth'

const Home = ({ artists }) => {
  const { user, isLoading } = useMe()
  // const [test, setTest] = useState('kotu')
  // if (!user) {
  //   console.log('server side')
  //   router.push('/signin')
  // }
  return (
    <Box height="100%">
      <Skeleton height="100%" isLoaded={!isLoading}>
        <GradientLayout
          roundImage
          color="gray"
          subtitle="profile"
          title={`${user?.firstName} ${user?.lastName}`}
          description={`${user?.playlistsCount} public playlists`}
          image="https://dl.dropboxusercontent.com/s/bgiv0ssz3xpotz9/peep.png?dl=0"
        >
          <Box color="white" paddingX="40px">
            <Box marginBottom="40px">
              <Text fontSize="2xl" fontWeight="bold">
                Top artist this month
              </Text>
              <Text fontSize="md">only visible to you</Text>
            </Box>
            <Flex>
              {artists.map((artist) => (
                <Box paddingX="10px" width="20%">
                  <Box
                    bg="gray.900"
                    borderRadius="4px"
                    padding="15px"
                    width="100%"
                  >
                    <Image
                      src="https://placekitten.com/300/300"
                      borderRadius="100%"
                    />
                    <Box marginTop="20px">
                      <Text fontSize="large">{artist.name}</Text>
                      <Text fontSize="x-small">Artist</Text>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Flex>
          </Box>
        </GradientLayout>
      </Skeleton>
    </Box>
  )
}

export const getServerSideProps = async ({ req }) => {
  try {
    validateToken(req.cookies.TRAX_ACCESS_TOKEN)
  } catch (e) {
    console.log('redirecting in index..tsx')
    return {
      redirect: {
        permanent: false,
        destination: '/signin',
      },
    }
  }

  const artists = await prisma.artist.findMany({})

  return {
    props: { artists },
  }
}

export default Home
