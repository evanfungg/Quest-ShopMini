import {useState} from 'react'
import {ScrollView} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {
  Box,
  SafeAreaView,
  Text,
  ProductCard,
  useProductSearch,
  useTheme,
  Button,
  TextField,
  RadioButton,
  Divider,
  useSavedProducts,
  useUpdateSavedProducts,
  useShopNavigation,
  useShopCart,
  type Product,
  ProductCardGrid,
} from '@shopify/shop-minis-platform-sdk'

import {RootStackParamList} from '../types/screens'
import {useQuest} from '../hooks/useQuest'

export function HomeScreen() {
  const theme = useTheme()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
  const {updateProgress} = useQuest()
  
  // Navigation and Cart hooks
  const shopNavigation = useShopNavigation()
  const shopCart = useShopCart()

  // Product related hooks
  const {products} = useProductSearch({
    query: 'skateboard',
    first: 4,
    filters: {
      minimumRating: 4,
      price: {
        min: 150,
        max: 250,
      },
    },
  })

  // User hooks for saved products
  const savedProductsResult = useSavedProducts({
    first: 20,
    includeVariants: false,
    includeSensitive: false
  })

  const updateSavedProducts = useUpdateSavedProducts()

  const handleAddToCart = async (product: Product) => {
    try {
      const variantId = product.defaultVariant.id
      if (!variantId) return

      await shopCart.addToCart({
        productId: product.id,
        productVariantId: variantId,
        quantity: 1,
      })
      updateProgress('addToCartCount')
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleProductPress = (product: Product) => {
    shopNavigation.navigateToProduct({
      productId: product.id,
    })
    updateProgress('productViewCount')
  }

  const handleLikeProduct = async (productId: string, product: Product) => {
    try {
      if (savedProductsResult.products.some(p => p.id === productId)) {
        await updateSavedProducts.unsaveProduct({ 
          productId,
          shopId: product.shop.id,
          productVariantId: product.defaultVariant.id
        })
      } else {
        await updateSavedProducts.saveProduct({ 
          productId,
          shopId: product.shop.id,
          productVariantId: product.defaultVariant.id
        })
        updateProgress('likedProductsCount')
      }
    } catch (error) {
      console.error('Failed to update saved products:', error)
    }
  }

  const handleQuantityChange = async (product: Product, quantity: number) => {
    try {
      const variantId = product.defaultVariant.id
      if (!variantId) return

      await shopCart.addToCart({
        productId: product.id,
        productVariantId: variantId,
        quantity,
      })
      updateProgress('quantityAdjustmentCount')
    } catch (error) {
      console.error('Failed to update quantity:', error)
    }
  }

  const radioButtonOptions = ['Option A', 'Option B', 'Option C']

  const [selectedOption, setSelectedOption] = useState(radioButtonOptions[0])
  const [textFieldValue, setTextFieldValue] = useState('')

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.colors['backgrounds-regular']}}
    >
      <ScrollView>
        <Box
          flex={1}
          paddingHorizontal="gutter"
          marginBottom="s"
          backgroundColor="backgrounds-regular"
        >
          <Box flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text variant="heroBold" marginBottom="s" marginTop="xs">
              Shop Products
            </Text>
            <Button
              text="View Quests"
              variant="tertiary"
              onPress={() => navigation.navigate('Quest')}
            />
          </Box>

          {products ? (
            <ProductCardGrid
              products={products}
              numColumns={2}
              horizontal={false}
              renderItem={({product}) => (
                <Box padding="xs">
                  <ProductCard
                    product={product}
                    selectedProductVariant={product.defaultVariant}
                    variant="default"
                    onFavoriteToggled ={async (isFavorited) => {
                      await handleLikeProduct(product.id, product)
                    }}
                  />
                </Box>
              )}
              contentContainerStyle={{padding: 8}}
            />
          ) : null}
          <Divider marginVertical="s" />

          <Text marginBottom="s">
            You can add interactions to your Mini with inputs.
          </Text>
          <Box>
            <TextField
              placeholder="I love Minis because..."
              value={textFieldValue}
              onChangeText={setTextFieldValue}
            />
            {textFieldValue ? (
              <Text marginTop="xs">I love Minis because {textFieldValue}</Text>
            ) : null}
          </Box>
          <Divider marginVertical="s" />

          <Text>Radio buttons</Text>
          {radioButtonOptions.map(option => (
            <Box key={option} marginVertical="xs">
              <RadioButton
                variant="tertiary"
                text={option}
                active={selectedOption === option}
                onPress={() => setSelectedOption(option)}
              />
            </Box>
          ))}
          <Divider marginVertical="s" />

          <Text marginBottom="s">
            Ready for more? Let&apos;s explore native capabilities in the
            screen.
          </Text>
          <Button
            text="Next"
            size="l"
            onPress={() => {
              navigation.navigate('GettingStarted.NativeFeatures')
            }}
          />
        </Box>
      </ScrollView>
    </SafeAreaView>
  )
}
